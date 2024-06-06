import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { LogDays, Prisma } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils/format-date";
import { TQueryLog } from "../models";
import { NotFoundError, ValidationError } from "../error";

const logList = async (query: TQueryLog): Promise<LogDays[]> => {
  try {
    let condition = filterLog(query);
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

const filterLog = (query: TQueryLog): Prisma.LogDaysWhereInput | undefined => {
  if (query?.devSerial) {
    let condition: Prisma.LogDaysWhereInput = { devSerial: query.devSerial };
    if (query?.filter) {
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