import { scheduleJob } from "node-schedule";
import { format } from "date-fns";
import { backupLog } from "../services";

const backupScheduleJob = () => {
  scheduleJob('0 0 0 * * *', () => {
    backupLog();
    const datetime: string = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
    console.log(`Backup will run everyday at ${datetime}`);
  })
}

export {
  backupScheduleJob
}