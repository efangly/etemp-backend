import { prisma } from "../configs";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getDeviceImage, getDateFormat, getDistanceTime, objToString } from "../utils";
import { Configs, Devices } from "@prisma/client";
import { NotFoundError } from "../error";
import { ResToken, TDevice } from "../models";
import { addHistory } from "./history.service";

const deviceList = async (token?: ResToken): Promise<Devices[]> => {
  try {
    const result = await prisma.devices.findMany({
      where: token?.userLevel === "4" ? { wardId: token.wardId } : 
        token?.userLevel === "3" ? { ward: { hosId: token?.hosId } } : {},
      include: {
        log: {
          orderBy: { sendTime: 'desc' }
        },
        probe: true,
        config: true,
        noti: {
          where: {
            OR: [
              { notiDetail: { contains: 'OVER' } },
              { notiDetail: { contains: 'LOWER' } }
            ],
            createAt: { gte: getDistanceTime('day') }
          },
          orderBy: { createAt: 'desc' }
        },
        _count: {
          select: { 
            warranty: true, 
            repair: true,
            history: { 
              where: {
                createAt: { gte: getDistanceTime('day') },
              } 
            },
            noti: { 
              where: {
                createAt: { gte: getDistanceTime('day') },
                AND: [
                  { notiDetail: { startsWith: 'PROBE' } },
                  { notiDetail: { endsWith: 'ON' } },
                ]
              } 
            }
          }
        }
      },
      orderBy: { devSeq: "asc" }
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const deviceById = async (deviceId: string): Promise<Devices | null> => {
  try {
    const result = await prisma.devices.findUnique({
      where: { devId: deviceId },
      include: {
        ward: { include: { hospital: { select: { hosName: true } } } },
        log: { orderBy: { sendTime: 'desc' } },
        probe: { orderBy: { probeCh: 'asc' } },
        config: true
      }
    });
    if (!result) throw new NotFoundError(`Device not found for : ${deviceId}`);
    return result
  } catch (error) {
    throw error;
  }
};

const addDevice = async (body: TDevice, pic?: Express.Multer.File): Promise<Devices> => {
  try {
    const seq: Devices[] = await deviceList();
    const result = await prisma.devices.create({
      data: {
        devId: `DEV-${uuidv4()}`,
        devName: `DEVICE-${uuidv4()}`,
        devSerial: String(body.devSerial),
        wardId: !body.wardId ? "WID-DEVELOPMENT" : body.wardId,
        locPic: pic ? `/img/device/${pic.filename}` : null,
        devSeq: seq.length === 0 ? 1 : seq[seq.length - 1].devSeq + 1,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date()),
        config: {
          create: {
            confId: `CONF-${uuidv4()}`,
            macAddWiFi: body.config?.macAddWiFi,
            createAt: getDateFormat(new Date()),
            updateAt: getDateFormat(new Date())
          }
        },
        probe: {
          create: {
            probeId: `PID-${uuidv4()}`,
            probeName: "",
            probeType: "",
            probeCh: "1",
            createAt: getDateFormat(new Date()),
            updateAt: getDateFormat(new Date())
          }
        }
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
};

const editDevice = async (deviceId: string, body: Devices, pic?: Express.Multer.File): Promise<Devices> => {
  try {
    const filename = await getDeviceImage(deviceId);
    if (body.dateInstall) body.dateInstall = getDateFormat(body.dateInstall);
    if (body.devSeq) body.devSeq = Number(body.devSeq);
    if (body.devStatus) body.devStatus = String(body.devStatus) == "1" ? true : false;
    body.updateAt = getDateFormat(new Date());
    body.locPic = pic ? `/img/device/${pic.filename}` : filename || null;
    const result: Devices = await prisma.devices.update({
      where: { devId: deviceId },
      data: body
    });
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/device', filename.split("/")[3]));
    return result;
  } catch (error) {
    throw error;
  }
};

const removeDevice = async (deviceId: string): Promise<Devices> => {
  try {
    const filename = await getDeviceImage(deviceId);
    const result = await prisma.devices.delete({ where: { devId: deviceId } });
    if (!!filename) fs.unlinkSync(path.join('public/images/device', filename.split("/")[3]));
    return result;
  } catch (error) {
    throw error;
  }
};

const findConfig = async (deviceId: string): Promise<Devices | null> => {
  try {
    const result = await prisma.devices.findUnique({
      where: { devSerial: deviceId },
      select:{
        devSerial: true,
        config: true,
        probe: true
      }
    });
    return result as unknown as Devices;
  } catch (error) {
    throw error;
  }
};

const editConfig = async (deviceId: string, body: Configs, token: ResToken): Promise<Configs> => {
  try {
    const detail = objToString(body);
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.configs.update({
      where: { devSerial: deviceId },
      data: body
    });
    await addHistory(`Config: [${detail}]`, result.devSerial, token.userId);
    return result;
  } catch (error) {
    throw error;
  }
};

export {
  deviceList,
  deviceById,
  addDevice,
  editDevice,
  removeDevice,
  findConfig,
  editConfig
};