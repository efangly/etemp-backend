import { prisma } from "../configs";
import { v4 as uuidv4 } from 'uuid';
import { LogDays } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils";
import { TQueryLog } from "../models";
import { NotFoundError, ValidationError } from "../error";
import { backupNoti, findHistoryNotification } from "./notification.service";

const logList = async (query: TQueryLog) => {
  try {
    if (query.devSerial && query.filter) {
      switch (query.filter) {
        case "day":
          const result = await prisma.logDays.findMany({
            where: {
              devSerial: query.devSerial,
              sendTime: { gte: getDistanceTime('day') }
            },
            include: { device: true },
            orderBy: { sendTime: 'asc' }
          });
          const dayAction = await findHistoryNotification(query.devSerial, getDistanceTime('day'), getDateFormat(new Date()));
          return { log: result, action: dayAction };
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
          const weekAction = await findHistoryNotification(query.devSerial, getDistanceTime('week'), getDateFormat(new Date()));
          return { log: weekBackup.concat(week), action: weekAction };
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
          const monthAction = await findHistoryNotification(query.devSerial, getDistanceTime('month'), getDateFormat(new Date()));
          return { log: monthBackup.concat(month), action: monthAction };
        default:
          const startDate = getDateFormat(new Date(query.filter.split(",")[0]));
          const endDate = getDateFormat(new Date(query.filter.split(",")[1]));
          const [logday, logdayBackup] = await prisma.$transaction([
            prisma.logDays.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: {
                  gte: startDate,
                  lte: endDate,
                }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            }),
            prisma.logDaysBackup.findMany({
              where: {
                devSerial: query.devSerial,
                sendTime: {
                  gte: startDate,
                  lte: endDate,
                }
              },
              include: { device: true },
              orderBy: { sendTime: 'asc' }
            })
          ]);
          const filterAction = await findHistoryNotification(query.devSerial, startDate, endDate);
          return { log: logdayBackup.concat(logday), action: filterAction };
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
    let responseMessage = "";
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
      responseMessage = "Backup log success";
    } else {
      responseMessage = "No log data for log backup";
    }
    return `${responseMessage} && ${await backupNoti()}`;
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