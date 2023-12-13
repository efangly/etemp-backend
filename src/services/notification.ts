import { getMessaging, Message } from "firebase-admin/messaging";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { ReceiveMsg } from "../interfaces/notification.interface";

interface Notification {
  noti_id: string,
  dev_id: string,
  noti_detail: string,
  noti_status: string,
}

const sendToPushNoti = async (topic: string, temp: number, hum: number): Promise<boolean> => {
  let res: boolean = false;
  const message: Message = {
    notification: {
      title: "แจ้งเตือน",
      body: 'อุณหภูมิสูงเกินกำหนด',
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
      console.log(response);
      res = true;
    }).catch((err) => {
      throw err;
    })

  return res ? true : false;
};

const createNotification = async (param: ReceiveMsg) => {
  const value: Notification = {
    noti_id: `noti-${uuidv4()}`,
    dev_id: param.device,
    noti_detail: '',
    noti_status: '0',
  }
  try{
    await prisma.notification.create({ data: value });
    await sendToPushNoti('test', param.temp, param.hum);
  }catch(err){
    console.log(err);
  };
};

export { sendToPushNoti, createNotification };