import dotenv from "dotenv";
import { sendToPushNoti } from "../utils/notification";
import prisma from "../configs/prisma.config";
import { Notifications } from "@prisma/client";
import { TTopic } from "../models";
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

const editNoti = async (notiId: string, body: Notifications): Promise<Notifications> => {
  try {
    return await prisma.notifications.update({
      where: { notiId: notiId },
      data: body
    })
  } catch (error) {
    throw error;
  }
};

const pushNotification = async (params: TTopic): Promise<boolean> => {
  try {
    return await sendToPushNoti(params.topic, params.msg, 60, 40);
  } catch(error) {
    throw error;
  }
};

export {
  notificationList,
  editNoti,
  pushNotification
};