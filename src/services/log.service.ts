import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { LogDays } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils/format-date";
import { TQueryLog } from "../models";
import { NotFoundError, ValidationError } from "../error";

const logList = async (query: TQueryLog): Promise<LogDays[]> => {
  try {
    if (query.devSerial && query.filter) {
      switch (query.filter) {
        case "day":
          return await prisma.logDays.findMany({
            where: {
              devSerial: query.devSerial,
              sendTime: { gte: getDistanceTime('day') }
            },
            include: { device: true },
            orderBy: { sendTime: 'asc' }
          });
        case "week":
          const [week, weekBackup] = await prisma.$transaction([
            prisma.logDays.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('day') }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            }),
            prisma.logDaysBackup.findMany({
              where: { 
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('week') } 
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            })
          ]);
          return weekBackup.concat(week);
        case "month":
          const [month, monthBackup] = await prisma.$transaction([
            prisma.logDays.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('day') }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            }),
            prisma.logDaysBackup.findMany({
              where: { 
                devSerial: query.devSerial,
                sendTime: { gte: getDistanceTime('month') } 
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            })
          ]);
          return monthBackup.concat(month);
        default:
          const [logday, logdayBackup] = await prisma.$transaction([
            prisma.logDays.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: {
                  gte: getDateFormat(new Date(query.filter.split(",")[0])),
                  lte: getDateFormat(new Date(query.filter.split(",")[1])),
                }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            }),
            prisma.logDaysBackup.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: {
                  gte: getDateFormat(new Date(query.filter.split(",")[0])),
                  lte: getDateFormat(new Date(query.filter.split(",")[1])),
                }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            })
          ]);
          return logdayBackup.concat(logday);
      }
    } else {
      return await prisma.logDays.findMany({
        where: { devSerial: query.devSerial },
        include: { device: true },
        orderBy: { sendTime: 'asc' }
      });
    }
  } catch (error) {
    throw error;
  }
}

const findLog = async (logId: string): Promise<LogDays> => {
  try {
    const result = await prisma.logDays.findUnique({
      where: { logId: logId }
    })
    if (!result) throw new NotFoundError(`Log not found for : ${logId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addLog = async (body: LogDays | LogDays[]) => {
  try {
    if (Array.isArray(body)) {
      let logArr: LogDays[] = [];
      body.forEach((log) => {
        if (log.tempValue !== 0 && log.humidityValue !== 0) {
          logArr.push({
            logId: `LOG-${uuidv4()}`,
            devSerial: log.devSerial,
            tempValue: log.tempValue,
            tempAvg: log.tempAvg,
            humidityValue: log.humidityValue,
            humidityAvg: log.humidityAvg,
            sendTime: getDateFormat(log.sendTime || new Date()),
            ac: log.ac,
            door1: log.door1,
            door2: log.door2,
            door3: log.door3,
            internet: log.internet,
            probe: log.probe,
            battery: log.battery,
            ambient: log.ambient,
            sdCard: log.sdCard,
            createAt: getDateFormat(new Date()),
            updateAt: getDateFormat(new Date()),
          });
        }
      });
      return await prisma.logDays.createMany({ data: logArr });
    } else {
      if (body.tempValue !== 0 && body.humidityValue !== 0) {
        body.logId = `LOG-${uuidv4()}`;
        body.sendTime = getDateFormat(body.sendTime || new Date());
        body.createAt = getDateFormat(new Date());
        body.updateAt = getDateFormat(new Date());
        return await prisma.logDays.create({ data: body });
      } else {
        throw new ValidationError("Invalid value!!");
      }
    }
  } catch (error) {
    throw error;
  }
};

const removeLog = async (logId: string) => {
  try {
    return await prisma.logDays.delete({
      where: { logId: logId }
    });
  } catch (error) {
    throw error;
  }
}

const backupLog = async (): Promise<string> => {
  try {
    const backupList = await prisma.logDays.findMany({
      where: {
        sendTime: { lt: getDistanceTime('day') }
      },
      orderBy: { createAt: 'asc' }
    });
    if (backupList.length > 0) {
      await prisma.logDaysBackup.createMany({
        data: backupList
      });
      await prisma.logDays.deleteMany({
        where: { sendTime: { lt: getDistanceTime('day') } }
      });
      return "Backup Success";
    } else {
      return "No data for backup";
    }
  } catch (error) {
    throw error;
  }
}

export {
  logList,
  findLog,
  addLog,
  removeLog,
  backupLog
};