import { format } from "date-fns";
import { writeFile } from "node:fs/promises"
import path from "node:path";
import fs from "node:fs"

const createLog = async (statusCode: string, message: string) => {
  const pathName = `public/logs/${format(new Date(), "yyyyMM")}`;
  if (!fs.existsSync(pathName)) fs.mkdirSync(pathName, { recursive: true });
  const logContent = `${format(new Date(), "yyyy/MM/dd'T'HH:mm:ss")} => Code: ${statusCode}, Message: ${message} \n`;
  await writeFile(path.join(pathName, `Log_${format(new Date(), "yyyyMMdd")}.log`), logContent, { flag: 'a+' });
}

export {
  createLog
}