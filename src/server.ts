import express,{ Application } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./configs/prisma.config";
import UserRouter from "./routes/user";
import NotiRouter from "./routes/noti";
import { credential } from "firebase-admin";
import { initializeApp } from 'firebase-admin/app';
import { connectMqtt } from "./configs/mqtt.config";
const serviceAccount = require('../temp-alarm-firebase-adminsdk-8vqko-fe5609cb68.json');

const App: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10);

//middleware
App.use(express.json());
App.use(cors({ origin: '*' }));
App.use(morgan("dev"));
//firebase
initializeApp({
  credential: credential.cert(serviceAccount),
  projectId: 'temp-alarm',
});
//mqtt
connectMqtt();

//route
App.use('/api/user', UserRouter);
App.use('/api', NotiRouter);
App.listen(port, () => console.log(`Start server in port ${port}`));