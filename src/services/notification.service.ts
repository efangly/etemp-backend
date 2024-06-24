import dotenv from "dotenv";
import { getMessaging, Message } from "firebase-admin/messaging";
import { prisma, socket } from "../configs";
import { Notifications, Prisma } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { ResToken } from "../models";
dotenv.config();

const notificationList = async (token: ResToken): Promise<Notifications[]> => {
  try {
    let condition: Prisma.NotificationsWhereInput = {}
    if (token?.userLevel === "4") {
      condition = { device: { ward: { wardId: token.wardId } } }
    } else if (token?.userLevel === "3") {
      condition = { device: { ward: { hosId: token.hosId } } }
    }
    return await prisma.notifications.findMany({
      where: condition,
      take: 99,
      include: {
        device: {
          select: {
            devId: true,
            devName: true,
            devSerial: true,
            devDetail: true
          }
        }
      },
      orderBy: [
        { notiStatus: 'asc' },
        { createAt: 'desc' }
      ]
    });
  } catch (error) {
    throw error;
  }
};

const findNotification = async (devSerial: string): Promise<Notifications[]> => {
  try {
    return await prisma.notifications.findMany({
      where: { devSerial: devSerial },
      take: 99,
      include: {
        device: {
          select: {
            devId: true,
            devName: true
          }
        }
      },
      orderBy: [
        { notiStatus: 'asc' },
        { createAt: 'desc' }
      ]
    });
  } catch (error) {
    throw error;
  }
};

const findHistoryNotification = async (devSerial: string, startDate: Date, endDate: Date) => {
  const [ noti, notiBackup ] = await prisma.$transaction([
    prisma.notifications.findMany({
      where: {
        devSerial: devSerial,
        AND: [
          { notiDetail: { startsWith: 'PROBE' } },
          { notiDetail: { endsWith: 'ON' } },
        ],
        createAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createAt: 'asc' }
    }),
    prisma.notificationsBackup.findMany({
      where: {
        devSerial: devSerial,
        AND: [
          { notiDetail: { startsWith: 'PROBE' } },
          { notiDetail: { endsWith: 'ON' } },
        ],
        createAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { createAt: 'asc' }
    })
  ]);
  return notiBackup.concat(noti);
}

const addNotification = async (body: Notifications): Promise<Notifications> => {
  try {
    body.notiId = `NID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.notifications.create({ data: body, include: { device: true } });
    const pushMessage = setDetailMessage(body.notiDetail);
    pushNotification('test', result.device.devDetail!, pushMessage);
    socket.emit("send_message", { device: result.device.devDetail, message: pushMessage, time: body.createAt.toString() });
    return result;
  } catch (error) {
    throw error;
  };
};

const editNotification = async (notiId: string, body: Notifications): Promise<Notifications> => {
  try {
    body.updateAt = getDateFormat(new Date());
    return await prisma.notifications.update({
      where: { notiId: notiId },
      data: body
    })
  } catch (error) {
    throw error;
  }
};

const pushNotification = async (topic: string, title: string, detail: string) => {
  try {
    const message: Message = {
      notification: {
        title: title,
        body: detail,
      },
      android: {
        notification: {
          sound: 'default',
          priority: 'max'
        },
        priority: 'high'
      },
      topic: topic
    };
    await getMessaging().send(message);
  } catch (error) {
    throw error;
  }
};

const setDetailMessage = (msg: string): string => {
  const msgType = msg.split("/");
  let detailMessage = "";
  switch (msgType[0]) {
    case "TEMP":
      if (msgType[1] === "OVER") {
        detailMessage = "Temperature is too high";
      } else if (msgType[1] === "LOWER") {
        detailMessage = "Temperature is too low";
      } else {
        detailMessage = "Temperature returned to normal";
      }
      break;
    case "SD":
      if (msgType[1] === "ON") {
        detailMessage = "SDCard connected";
      } else {
        detailMessage = "SDCard failed";
      }
      break;
    case "AC":
      if (msgType[1] === "ON") {
        detailMessage = "Power on";
      } else {
        detailMessage = "Power off";
      }
      break;
    case "PROBE1":
      detailMessage = `PROBE1: ${setProbe(msgType[1], msgType[2])}`;
      break;
    case "PROBE2":
      detailMessage = `PROBE2: ${setProbe(msgType[1], msgType[2])}`;
      break;
    case "PROBE3":
      detailMessage = `PROBE3: ${setProbe(msgType[1], msgType[2])}`;
      break;
    case "PROBE4":
      detailMessage = `PROBE4: ${setProbe(msgType[1], msgType[2])}`;
      break;
    default:
      detailMessage = msg;
  }
  return detailMessage;
}

const setProbe = (door: string, action: string): string => {
  let doorMsg = "";
  switch (door) {
    case "DOOR1":
      doorMsg = `DOOR1 is ${action === "ON" ? "opened" : "closed"}`;
      break;
    case "DOOR2":
      doorMsg = `DOOR2 is ${action === "ON" ? "opened" : "closed"}`;
      break;
    default:
      doorMsg = `DOOR3 is ${action === "ON" ? "opened" : "closed"}`;
  }
  return doorMsg;
}

const backupNoti = async (): Promise<string> => {
  try {
    const backupList = await prisma.notifications.findMany({
      where: {
        createAt: { lt: getDistanceTime('day') }
      },
      orderBy: { createAt: 'asc' }
    });
    if (backupList.length > 0) {
      await prisma.notificationsBackup.createMany({
        data: backupList
      });
      await prisma.notifications.deleteMany({
        where: { createAt: { lt: getDistanceTime('day') } }
      });
      return "Backup notification success";
    } else {
      return "No notification data for backup";
    }
  } catch (error) {
    throw error;
  }
}

export {
  notificationList,
  findNotification,
  addNotification,
  editNotification,
  pushNotification,
  backupNoti,
  findHistoryNotification
};