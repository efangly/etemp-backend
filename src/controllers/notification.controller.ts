import { Request, Response } from "express";
import dotenv from "dotenv";
import { sendToPushNoti } from "../services/notification";
import prisma from "../configs/prisma.config";
dotenv.config();

const getNotification = async (req: Request, res: Response) => {
  await prisma.notification.findMany({
    select:{
      noti_id: true,
      noti_detail: true,
      noti_status: true,
      createAt: true,
      device: {
        select: {
          dev_id: true,
          dev_name: true,
          dev_sn: true
        }
      }
    },
    orderBy: [
      { noti_status: 'asc' },
      { createAt: 'desc' }
    ]
  }).then((result) => {
    res.json({
      status: 200,
      value: result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const setToReadNoti = async (req: Request, res: Response) => {
  const { noti_id } = req.params;
  const { noti_status } = req.body;
  await prisma.notification.update({
    where: {
      noti_id: noti_id
    },
    data: { noti_status: noti_status }
  }).then((result) => {
    res.json({
      status: 200,
      value: result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const setPushNotification = async (req: Request, res: Response) => {
  const params: { topic: string, msg: string } = req.body;
  try {
    await sendToPushNoti(params.topic, params.msg, 60, 40);
    res.status(200).json({ status: 200, msg: "Messages were sent successfully!!" });
  }catch(err){
    res.status(400).json({ status: 400, msg: "Error", error: err });
  }
};

export default {
  getNotification,
  setToReadNoti,
  setPushNotification
};