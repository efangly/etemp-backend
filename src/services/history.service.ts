import { ConfigHistory, Prisma } from "@prisma/client";
import { prisma, redisConn } from "../configs";
import { ResToken } from "../models";
import { getDateFormat } from "../utils";
import { v4 as uuidv4 } from 'uuid';

const historyList = async (token: ResToken): Promise<ConfigHistory[]> => {
  try {
    let conditions: Prisma.ConfigHistoryWhereInput | undefined = undefined;
    let keysName: string = "";
    switch (token?.userLevel) {
      case "3":
        conditions = { user: { wardId: token.wardId } };
        keysName = `history:${token.wardId}`;
        break;
      case "2":
        conditions = { user: { ward: { hosId: token.hosId } } };
        keysName = `history:${token.hosId}`;
        break;
      default:
        conditions = undefined;
        keysName = "history";
    }
    // get cache
    const cachedData = await redisConn.get(keysName);
    if (cachedData) {
      return JSON.parse(cachedData) as unknown as ConfigHistory[];
    }
    const result = prisma.configHistory.findMany({
      where: conditions,
      select: {
        detail: true,
        devSerial: true,
        user: { select: { displayName: true } },
        createAt: true
      },
      orderBy: { createAt: 'desc' }
    });
    // set cache
    await redisConn.setEx(keysName, 3600 * 6, JSON.stringify(result));
    return result as unknown as ConfigHistory[];
  } catch (error) {
    throw error;
  }
}

const addHistory = async (detail: string, serial: string, userId: string) => {
  try {
    const result = prisma.configHistory.create({
      data: {
        id: uuidv4(),
        detail: detail,
        devSerial: serial,
        userId: userId,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date())
      },
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

export {
  addHistory,
  historyList
}