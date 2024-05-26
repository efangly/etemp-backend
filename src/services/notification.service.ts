import dotenv from "dotenv";
import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { Notifications } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
import { v4 as uuidv4 } from 'uuid';
dotenv.config();

const notificationList = async (): Promise<Notifications[]> => {
  try {
    return await prisma.notifications.findMany({
      include: {
        device: {
          select: {
            devId: true,
            devName: true,
            devSerial: true
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

const findNotification = async (deviceId: string): Promise<Notifications[]> => {
  try {
    return await prisma.notifications.findMany({
      where: { devId: deviceId },
      include: {
        device: {
          select: {
            devId: true,
            devName: true,
            devSerial: true
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
    await getMessaging().send(message)
  } catch (error) {
    throw error;
  }
};

export {
  notificationList,
  findNotification,
  addNotification,
  editNotification,
  pushNotification
};