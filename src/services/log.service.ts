import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { LogDays } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils/format-date";
import { TQueryLog } from "../models";
import { NotFoundError } from "../error";

type filter = {
  devId: string,
  sendTime?: {
    gte: Date,
    lte?: Date
  }
}

const logList = async (query: TQueryLog): Promise<LogDays[]> => {
  try {
    let condition: filter | undefined = filterLog(query);
    console.log(condition)
    return await prisma.logDays.findMany({
      where: condition,
      include: {
        device: true
      },
      orderBy: {
        sendTime: 'desc'
      }
    })
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
        logArr.push({
          logId: `LOG-${uuidv4()}`,
          devId: log.devId,
          tempValue: log.tempValue,
          tempAvg: log.tempAvg,
          humidityValue: log.humidityValue,
          humidityAvg: log.humidityAvg,
          sendTime: getDateFormat(log.sendTime),
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
      });
      return await prisma.logDays.createMany({ data: logArr });
    } else {
      body.logId = `LOG-${uuidv4()}`;
      body.sendTime = getDateFormat(body.sendTime);
      if (body.door1) body.door1 = String(body.door1) == "1" ? true : false;
      if (body.door2) body.door2 = String(body.door2) == "1" ? true : false;
      if (body.door3) body.door3 = String(body.door3) == "1" ? true : false;
      if (body.internet) body.internet = String(body.internet) == "1" ? true : false;
      body.createAt = getDateFormat(new Date());
      body.updateAt = getDateFormat(new Date());
      return await prisma.logDays.create({ data: body });
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

const filterLog = (query: TQueryLog) => {
  if (query?.devId) {
    let condition: filter = { devId: query.devId };
    if (query.filter) {
      switch (query.filter) {
        case 'day':
          condition.sendTime = {
            gte: getDistanceTime('day')
          };
          break;
        case 'week':
          condition.sendTime = {
            gte: getDistanceTime('week')
          };
          break;
        case 'month':
          condition.sendTime = {
            gte: getDistanceTime('month')
          };
          break;
        default:
          condition.sendTime = {
            gte: getDateFormat(new Date(query.filter.split(",")[0])),
            lte: getDateFormat(new Date(query.filter.split(",")[1])),
          };
      }
      return condition;
    } else {
      return condition;
    }
  } else {
    return undefined;
  }
}

export {
  logList,
  findLog,
  addLog,
  removeLog
};