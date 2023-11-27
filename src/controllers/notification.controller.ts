import { Request, Response } from "express";
import dotenv from "dotenv";
import { sendToPushNoti } from "../services/sendnotification";
dotenv.config();

const setPushNotification = async (req: Request, res: Response) => {
  const params: { token: string } = req.body;
  const push = await sendToPushNoti(params.token, 60, 40);
  if(push){
    res.json({ msg: "messages were sent successfully" });
  }else{
    res.status(400).json({ msg: "ERROR" });
  }
};

export {
  setPushNotification
};