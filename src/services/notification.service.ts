import dotenv from "dotenv";
import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { Notifications, Prisma } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../utils/format-date";
import { v4 as uuidv4 } from 'uuid';
import { socket } from "../configs/socket.config";
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

const addNotification = async (body: Notifications): Promise<Notifications> => {
  try {
    body.notiId = `NID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.notifications.create({ data: body });
    pushNotification('test', body.notiDetail);
    socket.emit("send_message", { device: body.devSerial, message: body.notiDetail, time: body.createAt.toString() });
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

const pushNotification = async (topic: string, detail: string) => {
  try {
    const message: Message = {
      notification: {
        title: "แจ้งเตือน",
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

const setDetailMessage = (msg: string) => {

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
  backupNoti
};