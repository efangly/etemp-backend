import { format } from "date-fns";
import { writeFile } from "node:fs/promises"
import path from "node:path";

const createLog = async (message: string) => {
  const logContent = `${format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")} => ${message} \n`;
  await writeFile(path.join('logs', `Log_${format(new Date(), "yyyyMMdd")}.log`), logContent, { flag: 'a+' })
}

export {
  createLog
}