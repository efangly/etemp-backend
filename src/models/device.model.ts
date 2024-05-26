import { z } from "zod";

export const ZDeviceParam = z.object({ devId: z.string() });

export const ZDevice = z.object({
  devId: z.string().optional(),
  wardId: z.string().optional(),
  devSerial: z.string().optional(),
  devName: z.string().optional(),
  devDetail: z.string().optional(),
  devStatus: z.string().optional(),
  devSeq: z.string().optional(),
  devZone: z.string().optional(),
  locInstall: z.string().optional(),
  locPic: z.string().optional(),
  dateInstall: z.date().optional(),
  firmwareVersion: z.string().optional(),
  createBy: z.string().optional(),
  comment: z.string().optional(),
  backupStatus: z.string().optional(),
  moveStatus: z.string().optional(),
  alarn: z.string().optional(),
  duration: z.number().optional()
});

export const ZConfig = z.object({
  confId: z.string().optional(),
  ip: z.string().optional(),
  macAddEth: z.string().optional(),
  macAddWiFi: z.string().optional(),
  subNet: z.string().optional(),
  getway: z.string().optional(),
  dns: z.string().optional(),
  ssid: z.string().optional(),
  ssidPass: z.string().optional(),
  sim: z.string().optional(),
  email1: z.string().optional(),
  email2: z.string().optional(),
  email3: z.string().optional(),
  notiTime: z.number().optional(),
  backToNormal: z.boolean().optional(),
  mobileNoti: z.boolean().optional(),
  repeat: z.number().optional(),
  devId: z.string().optional(),
});