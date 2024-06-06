import express,{ Application } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./configs/prisma.config";
import routes from "./routes";
// import { initRedis } from "./configs/redis.config";
import { backupScheduleJob } from "./utils/schedule";
import connectFireBase from "./configs/firebase.config";
import { globalErrorHanlder } from "./middlewares";
import { socket } from "./configs/socket.config";

const app: Application = express();

dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 8080;

//middleware
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(morgan("dev"));

//route 
app.use('/etemp', routes);
app.use(globalErrorHanlder);

app.listen(port, async () => {
  // await initRedis();
  connectFireBase();
  backupScheduleJob();
  socket.on('connect', () => console.log("Socket Connected"));
  socket.on('disconnect', () => console.log("Socket Disconnected"));
  console.log(`Start server in port ${port}`);
  console.log(process.env.NODE_ENV === 'production' ? 'Production Mode' : 'Developer Mode');
});