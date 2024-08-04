import { z } from "zod";

export const ZDeviceParam = z.object({ devId: z.string() });
export const ZConfigParam = z.object({ devSerial: z.string() });
export const ZChangeSeqParam = z.object({ 
  devId: z.string(), 
  afterDevId: z.string() 
});
export const ZChangeSeqBody = z.object({ 
  devSeq: z.number(), 
  afterDevSeq: z.number() 
});
export const ZQueryDevice = z.object({
  start: z.string().optional(),
  end: z.string().optional()
});
export type TDevice = z.infer<typeof ZDevice>;
export type TQueryDevice = z.infer<typeof ZQueryDevice>;

export const ZConfig = z.object({
  confId: z.string().optional(),
  mode: z.string().optional(),
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
  notiTime: z.string().optional(),
  backToNormal: z.string().optional(),
  mobileNoti: z.string().optional(),
  repeat: z.string().optional(),
  devSerial: z.string().optional(),
});

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
  alarm: z.string().optional(),
  duration: z.number().optional(),
  config:  ZConfig.optional()
});