import express,{ Application } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./configs/prisma.config";
import routes from "./routes";
import path from "node:path";
// import { initRedis } from "./configs/redis.config";
import { connectMqtt } from "./configs/mqtt.config";
import { backupScheduleJob } from "./utils/schedule";
import connectFireBase from "./configs/firebase.config";
import { globalErrorHanlder } from "./middlewares";

const app: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 8080;

//middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan("dev"));

//route 
app.use('/api', routes);
app.use('/img', express.static('public/images'));
app.use('/font', express.static('public/fonts'));
app.use(globalErrorHanlder);

app.listen(port, async () => {
  console.log(`Start server in port ${port}`);
  console.log(process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Developer Mode');
  // await initRedis();
  connectFireBase();
  connectMqtt();
  backupScheduleJob();
});