import { Request, Response } from "express";
import dotenv from "dotenv";
import { sendToPushNoti } from "../services/notification";
dotenv.config();

const setPushNotification = async (req: Request, res: Response) => {
  const params: { topic: string } = req.body;
  try {
    await sendToPushNoti(params.topic, 60, 40);
    res.status(200).json({ status: 200, msg: "Messages were sent successfully!!" });
  }catch(err){
    res.status(400).json({ status: 400, msg: "Error", error: err });
  }
};

export {
  setPushNotification
};