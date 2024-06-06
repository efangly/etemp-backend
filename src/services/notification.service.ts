import dotenv from "dotenv";
import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { Notifications, Prisma } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
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
      where: { devSerial: deviceId },
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

export {
  notificationList,
  findNotification,
  addNotification,
  editNotification,
  pushNotification
};