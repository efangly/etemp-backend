import { prisma } from "../configs";
import { v4 as uuidv4 } from 'uuid';
import { LogDays } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils";
import { TQueryLog } from "../models";
import { NotFoundError, ValidationError } from "../error";
import { backupNoti } from "./notification.service";
import { format } from "date-fns";

const logList = async (query: TQueryLog): Promise<LogDays[]> => {
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
          return result;
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
          return query.type ? weekBackup.concat(week) : splitLog(weekBackup.concat(week), 2);
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
          return query.type ? monthBackup.concat(month) : splitLog(monthBackup.concat(month), 4);
        default:
          const startDate = getDateFormat(new Date(query.filter.split(",")[0]));
          const endDate = getDateFormat(new Date(query.filter.split(",")[1]));
          let diffDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
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
          const splitTime = diffDays <= 7 ? 2 : diffDays > 7 && diffDays <= 20 ? 3 : 4;
          const value = diffDays == 1 ? logdayBackup.concat(logday) : splitLog(logdayBackup.concat(logday), splitTime);
          return query.type ? logdayBackup.concat(logday) : value;
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
        const sendTimeYear = format(log.sendTime, "yyyy");
        const currentYear = format(new Date(), "yyyy");
        if (log.tempValue !== 0 && log.humidityValue !== 0 && sendTimeYear === currentYear) {
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
      return logArr.length > 0 ? await prisma.logDays.createMany({ data: logArr }) : [];
    } else {
      const sendTimeYear = format(body.sendTime, "yyyy");
      const currentYear = format(new Date(), "yyyy");
      if (body.tempValue !== 0 && body.humidityValue !== 0 && sendTimeYear === currentYear) {
        body.logId = `LOG-${uuidv4()}`;
        body.sendTime = getDateFormat(body.sendTime);
        body.createAt = getDateFormat(new Date());
        body.updateAt = getDateFormat(new Date());
        return await prisma.logDays.create({ data: body });
      } else {
        if (sendTimeYear === currentYear) {
          throw new ValidationError("Invalid log value!!");
        } else {
          throw new ValidationError(`Invalid date: Expected years ${currentYear}, received ${sendTimeYear}`);
        }
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

const splitLog = (log: LogDays[], time: number = 1) => {
  let result: LogDays[] = log;
  for (let i = 0; i < time; i++) {
    result = result.filter((_item, index) => index % 2 === 0);
  }
  return result;
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