import dotenv from "dotenv";
import { getMessaging, Message } from "firebase-admin/messaging";
import { prisma, socket } from "../configs";
import { Notifications, Prisma } from "@prisma/client";
import { checkCachedData, getDateFormat, getDistanceTime, removeCache, setCacheData } from "../utils";
import { v4 as uuidv4 } from 'uuid';
import { ResToken } from "../models";
dotenv.config();
let isSend = false;

const notificationList = async (token: ResToken): Promise<Notifications[]> => {
  try {
    let conditions: Prisma.NotificationsWhereInput | undefined = undefined;
    let keyName = "";
    switch (token.userLevel) {
      case "3":
        conditions = { device: { ward: { wardId: token.wardId } } };
        keyName = `noti:${token.wardId}`;
        break;
      case "2":
        conditions = { device: { ward: { hosId: token.hosId } } };
        keyName = `noti:${token.hosId}`;
        break;
      case "1":
        conditions = { NOT: { device: { wardId: "WID-DEVELOPMENT" } } };
        keyName = "noti:WID-DEVELOPMENT";
        break;
      default:
        conditions = undefined;
        keyName = "noti";
    }
    const cache = await checkCachedData(keyName);
    if (cache) return JSON.parse(cache);
    const result = await prisma.notifications.findMany({
      where: conditions,
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
    // set cache
    await setCacheData(keyName, 300, JSON.stringify(result));
    return result;
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
  const [noti, notiBackup] = await prisma.$transaction([
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
    const result = await prisma.notifications.create({
      data: body,
      include: {
        device: { include: { ward: true } }
      }
    });
    const pushMessage = setDetailMessage(body.notiDetail);
    if (result.device.ward.hosId === "HID-DEVELOPMENT") {
      pushNotification('admin', result.device.devDetail!, pushMessage);
    } else {
      pushNotification(result.device.wardId, result.device.devDetail!, pushMessage);
      pushNotification(result.device.ward.hosId, result.device.devDetail!, pushMessage);
      pushNotification('admin', result.device.devDetail!, pushMessage);
      pushNotification('service', result.device.devDetail!, pushMessage);
    }
    if (!isSend) {
      isSend = true;
      socket.emit("send_message", {
        device: result.device.devDetail,
        message: pushMessage,
        hospital: result.device.ward.hosId,
        time: body.createAt.toString()
      });
      setTimeout(() => {
        isSend = false;
      }, 5000);
    }
    await removeCache("device");
    await removeCache("noti");
    return result;
  } catch (error) {
    throw error;
  };
};

const editNotification = async (notiId: string, body: Notifications): Promise<Notifications> => {
  try {
    body.updateAt = getDateFormat(new Date());
    await removeCache("noti");
    return await prisma.notifications.update({
      where: { notiId: notiId },
      data: body
    })
  } catch (error) {
    throw error;
  }
};

const deviceEvent = async (clientid: string, event: string): Promise<string> => {
  try {
    if (clientid.substring(0, 4) === "eTPV" || clientid.substring(0, 4) === "iTSV") {
      const result = await prisma.devices.update({
        where: { devSerial: clientid },
        data: { backupStatus: event === "client.connected" ? "1" : "0" }
      });
      await removeCache("device");
      socket.emit("send_message", {
        device: result.devDetail,
        message: event === "client.connected" ? "Device online" : "Device offline",
        hospital: result.wardId,
        time: getDateFormat(new Date()).toString()
      });
    }
    return "OK";
  } catch (error) {
    throw error;
  }
}

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
      detailMessage = msgType[1] === "ON" ? "SDCard connected" : "SDCard failed";
      break;
    case "AC":
      detailMessage = msgType[1] === "ON" ? "Power on" : "Power off";
      break;
    default:
      detailMessage = `${msgType[0]}: ${msgType[1]} is ${msgType[2] === "ON" ? "opened" : "closed"}`;
  }
  return detailMessage;
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
  findHistoryNotification,
  deviceEvent
};