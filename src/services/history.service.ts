import prisma from "../configs/prisma.config";
import { ResToken } from "../models";
import { getDateFormat } from "../utils/format-date";
import { v4 as uuidv4 } from 'uuid';

const historyList = async (token: ResToken) => {
  try {
    const result = prisma.configHistory.findMany({
      where: token.userLevel === "4" ? { user: { wardId: token.wardId } } :
        token.userLevel === "3" ? { user: { ward: { hosId: token.hosId } } } : {},
      select: {
        detail: true,
        devSerial: true,
        user: { select: { displayName: true } },
        createAt: true
      },
      orderBy: { createAt: 'desc' }
    });
    return result;
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