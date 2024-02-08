import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getDeviceImage } from "../services/image";
import { Devices } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getDateFormat } from "../services/formatdate";

const getDevice = async (req: Request, res: Response) => {
  await prisma.devices.findMany({
    include: {
      log: {
        take: 1,
        orderBy: {
          send_time: 'desc'
        }
      }
    }
  }).then((result) => {
    res.json({ 
      status: 200,
      value : result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const getDeviceByid = async (req: Request, res: Response) => {
  const { dev_id } = req.params;
  let whereCondition: any = {};
  if(req.originalUrl.split("/")[3] === 'adjust'){
    whereCondition = {
      where: {
        dev_id: dev_id
      },
      select: {
        dev_id: true,
        temp_min: true,
        temp_max: true,
        hum_min: true,
        hum_max: true,
        adjust_hum: true,
        adjust_temp: true,
        delay_time: true,
        max_probe: true,
        door: true
      }
    }
  }else{
    whereCondition = {
      where: {
        dev_id: dev_id
      },
      include: {
        log: {
          orderBy: { send_time: 'desc' }
        }
      }
    }
  }
  await prisma.devices.findUnique({
    where: {
      dev_id: dev_id
    },
    include: {
      ward: { include: { hospital: true } },
      log: { orderBy: { send_time: 'desc' } }
    }
  }).then((result) => {
    if(!result){
      res.status(404).json({ status: 404, value : 'ไม่พบข้อมูล' });
    }else{
      res.status(200).json({ status: 200, value : result });
    }
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const createDevice = async (req: Request, res: Response) => {
  const params: Devices = req.body;
  const pathfile: string | null = req.file !== undefined ? `/img/device/${req.file.filename}` : null;
  params.dev_id = `DEV-${uuidv4()}`;
  params.group_id = !params.group_id ? "WID-DEVELOP" : params.group_id;
  params.location_pic = pathfile;
  params.lastmodified = getDateFormat(new Date());
  await prisma.devices.create({
    data: params
  }).then((result) => {
    res.status(201).json({ status: 201, msg: "Create Suscess!!", data : result });
  }).catch((err) => {
    if(req.file !== undefined) fs.unlinkSync(path.join('public/images/device', String(req.file?.filename)));
    if(err instanceof PrismaClientKnownRequestError){
      res.status(400).json({ status: 400, error: err.code === 'P2002' ? 'Serial Number ซ้ำ' : err });
    }else{
      res.status(400).json({ status: 400, error: err });
    }
  });
};

const updateDevice = async (req: Request, res: Response) => {
  const params: Devices = req.body;
  const { dev_id } = req.params;
  const file: string | undefined = req.file?.filename;
  try {
    const filename = await getDeviceImage(dev_id);
    if(params.temp_min) params.temp_min = Number(params.temp_min);
    if(params.temp_max) params.temp_max = Number(params.temp_max);
    if(params.hum_min) params.hum_min = Number(params.hum_min);
    if(params.hum_max) params.hum_max = Number(params.hum_max);
    if(params.adjust_temp) params.adjust_temp = Number(params.adjust_temp);
    if(params.adjust_hum) params.adjust_hum = Number(params.adjust_hum);
    if(params.install_date) params.install_date = getDateFormat(params.install_date);
    params.lastmodified = getDateFormat(new Date());
    params.location_pic = String(req.file === undefined ? filename : `/img/device/${file}`);
    const result: Devices = await prisma.devices.update({
      where: {
        dev_id: dev_id
      },
      data: params
    });
    if (req.file !== undefined && !!filename) {
      fs.unlinkSync(path.join('public/images/device', String(filename?.split("/")[3])));
    }
    res.json({ status: 200, msg: 'Update Successful!!', value: result });
  } catch (err) {
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/device', String(file)));
    res.status(400).json({ error: err });
  }
};

const adjustDevice = async (req: Request, res: Response) => {
  const params: Devices = req.body;
  const { dev_id } = req.params;
  await prisma.devices.update({
    where: {
      dev_id: dev_id
    },
    data: params
  }).then((result) => {
    res.status(200).json({ status: 200, msg: "Adjust Suscess!!", data : result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  })
    
};

const deleteDevice = async (req: Request, res: Response) => {
  const { dev_id } = req.params;
  try {
    const filename = await getDeviceImage(dev_id);
    await prisma.devices.delete({ where: { dev_id: dev_id }});
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/device', String(filename?.split("/")[3])));
    res.json({ status: 200, msg: 'Delete Successful!!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export default {
  getDevice,
  getDeviceByid,
  createDevice,
  updateDevice,
  adjustDevice,
  deleteDevice
};