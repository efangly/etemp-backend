import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getDeviceImage } from "../services/image";
import { devices } from "@prisma/client";

const getDevice = async (req: Request, res: Response) => {
  await prisma.devices.findMany().then((result) => {
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
  await prisma.devices.findUnique({
    where: {
      dev_id: dev_id
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
  const params: devices = req.body;
  const pathfile: string | null = req.file !== undefined ? `/img/device/${req.file.filename}` : null;
  params.dev_id = `DEV-${uuidv4()}`;
  params.group_id = !params.group_id ? "WID-DEVELOP" : params.group_id;
  params.location_pic = pathfile;
  console.log(params)
  await prisma.devices.create({
    data: params
  }).then((result) => {
    res.status(201).json({ status: 201, msg: "Create Suscess!!", data : result });
  }).catch((err) => {
    if(req.file !== undefined) fs.unlinkSync(path.join('public/images/device', String(req.file?.filename)));
    res.status(400).json({ error: err });
  });
};

const updateDevice = async (req: Request, res: Response) => {
  const params: devices = req.body;
  const { dev_id } = req.params;
  const file: string | undefined = req.file?.filename;
  try {
    const filename = await getDeviceImage(dev_id);
    let value = {
      group_id: params.group_id,
      guarantee_id: params.guarantee_id,
      dev_sn: params.dev_sn,
      dev_name: params.dev_name,
      dev_status: params.dev_status,
      temp_min: params.temp_min,
      temp_max: params.temp_max,
      hum_min: params.hum_min,
      hum_max: params.hum_max,
      adjust_temp: params.adjust_temp,
      adjust_hum: params.adjust_hum,
      delay_time: params.delay_time,
      max_probe: params.max_probe,
      door: params.door,
      dev_zone: params.dev_zone,
      install_location: params.install_location,
      location_pic: String(req.file === undefined ? filename : `/img/device/${file}`),
      install_date: params.install_date,
      dev_ip: params.dev_ip,
      dev_gatway: params.dev_gatway,
      dev_subnet: params.dev_subnet,
      dev_macaddress: params.dev_macaddress,
      software_version: params.software_version,
      firmware_version: params.firmware_version,
      invoice: params.invoice,
      createby: params.createby,
      comment: params.comment,
      backup_status: params.backup_status,
      move_status: params.move_status
    };
    const result: devices = await prisma.devices.update({
      where: {
        dev_id: dev_id
      },
      data: value
    })
    if (req.file !== undefined && filename) {
      fs.unlinkSync(path.join('public/images/device', String(filename?.split("/")[3])));
    }
    res.json({ status: 200, msg: 'Update Successful!!', value: result });
  } catch (err) {
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/device', String(file)));
    res.status(400).json({ error: err });
  }
};

const deleteDevice = async (req: Request, res: Response) => {
  const { dev_id } = req.params;
  try {
    const filename = await getDeviceImage(dev_id);
    await prisma.devices.delete({ where: { dev_id: dev_id }})
    fs.unlinkSync(path.join('public/images/device', String(filename?.split("/")[3])));
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
  deleteDevice
};