import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { ReceiveMsg, Notification } from "../interfaces/notification.interface";

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
  const value: Notification = {
    noti_id: `noti-${uuidv4()}`,
    dev_id: param.device,
    noti_detail: param.msg === 'greater' ? 'อุณหภูมิสูงกว่าที่กำหนด' : 'อุณหภูมิต่ำกว่าที่กำหนด',
    noti_status: '0',
  } // greater = อุณหภูมิสูง ,less = อุณหภูมิต่ำ
  try{
    await prisma.notification.create({ data: value });
    await sendToPushNoti('test', param.msg, param.temp, param.hum);
    return true;
  }catch(err){
    console.log({ msg: 'Create Notofocation Fail' });
    return false;
  };
};

export { sendToPushNoti, createNotification };