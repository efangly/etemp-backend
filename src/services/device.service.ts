import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getDeviceImage } from "../utils/image";
import { Configs, Devices, Prisma } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const deviceList = async (): Promise<Devices[]> => {
  // const { user_level, hos_id } = res.locals.token;
  try {
    const result = await prisma.devices.findMany({
      include: {
        log: {
          take: 1,
          orderBy: { sendTime: 'desc' }
        },
        probe: true,
        config: true
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

const addDevice = async (body: Devices, pic?: Express.Multer.File): Promise<Devices> => {
  try {
    const seq: Devices[] = await deviceList();
    // body.devId = `DEV-${uuidv4()}`;
    // body.devName = `DEVICE-${uuidv4()}`;
    // body.wardId = !body.wardId ? "WID-DEVELOPMENT" : body.wardId;
    // body.locationPic = pic ? `/img/device/${pic.filename}` : null;
    // body.devSeq = seq.length === 0 ? 1 : seq[seq.length - 1].devSeq + 1;
    // body.createAt = getDateFormat(new Date());
    // body.updateAt = getDateFormat(new Date());
    const result = await prisma.devices.create({
      data: {
        devId: `DEV-${uuidv4()}`,
        devName: `DEVICE-${uuidv4()}`,
        devSerial: body.devSerial,
        wardId: !body.wardId ? "WID-DEVELOPMENT" : body.wardId,
        locationPic: pic ? `/img/device/${pic.filename}` : null,
        devSeq: seq.length === 0 ? 1 : seq[seq.length - 1].devSeq + 1,
        createAt: getDateFormat(new Date()),
        updateAt: getDateFormat(new Date()),
        config: {
          create: {
            confId: `CONF-${uuidv4()}`,
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
    if (body.installDate) body.installDate = getDateFormat(body.installDate);
    body.updateAt = getDateFormat(new Date());
    body.locationPic = pic ? `/img/device/${pic.filename}` : filename || null;
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

const editConfig = async (confId: string, body: Configs): Promise<Configs> => {
  try {
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.configs.update({
      where: { confId: confId },
      data: body
    });
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
  editConfig
};