import express,{ Application } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./configs/prisma.config";
import Router from "./routes";
import { initRedis } from "./configs/redis.config";
import { connectMqtt } from "./configs/mqtt.config";
import { backupScheduleJob } from "./services/schedule";
import connectFireBase from "./configs/firebase.config";

const App: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 8080;

//middleware
App.use(express.json());
App.use(cors({ origin: '*' }));
App.use(morgan("dev"));

//route
App.use('/api/user', Router.UserRouter);
App.use('/api/noti', Router.NotiRouter);
App.use('/api/device', Router.DeviceRouter);
App.use('/api/log', Router.LogRouter);
App.use('/api/hospital', Router.HospitalRouter);
App.use('/api/group', Router.GroupRouter);
App.use('/api/repair', Router.RepairRouter);
App.use('/api', Router.AuthRouter);
App.use('/img', express.static('public/images'));
App.use('/font', express.static('public/fonts'));

App.listen(port, async () => {
  console.log(`Start server in port ${port}`);
  console.log(process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Developer Mode');
  await initRedis();
  connectFireBase();
  connectMqtt();
  backupScheduleJob();
});