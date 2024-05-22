import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { Notifications } from "@prisma/client";
import { getDateFormat } from "./format-date";

export interface ReceiveMsg {
  device: string, 
  msg: string,
  temp: number, 
  hum: number
};


const sendToPushNoti = async (topic: string, msg: string, temp: number, hum: number): Promise<boolean> => {
  let res: boolean = false;
  const message: Message = {
    notification: {
      title: "แจ้งเตือน",
      body: msg === 'greater' ? 'อุณหภูมิสูงกว่าที่กำหนด' : 'อุณหภูมิต่ำกว่าที่กำหนด',
    },
    data: {
      temp: String(temp),
      hum: String(hum)
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
    .then((response) => {
      res = true;
    }).catch((err) => {
      throw err;
    })
  return res ? true : false;
};

const createNotification = async (param: ReceiveMsg): Promise<boolean> => {
  const value: Notifications = {
    notiId: `noti-${uuidv4()}`,
    devId: param.device,
    notiDetail: param.msg === 'greater' ? 'อุณหภูมิสูงกว่าที่กำหนด' : 'อุณหภูมิต่ำกว่าที่กำหนด',
    notiStatus: false,
    createAt: getDateFormat(new Date()),
    updateAt: getDateFormat(new Date())
  } // greater = อุณหภูมิสูง ,less = อุณหภูมิต่ำ
  try{
    await prisma.notifications.create({ data: value });
    await sendToPushNoti('test', param.msg, param.temp, param.hum);
    return true;
  }catch(err){
    console.log({ msg: 'Create Notofocation Fail' });
    return false;
  };
};

export { sendToPushNoti, createNotification };
