import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { devices } from "@prisma/client";

const getDevice = async (req: Request, res: Response) => {
  await prisma.devices.findMany({
    select: {
      dev_id: true,
      hos_id: true,
      group_id: true,
      dev_sn: true,
      dev_name: true,
      temp_min: true,
      temp_max: true,
      hum_min: true,
      hum_max: true,
      location_pic: true
    },
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
  const { deviceid } = req.params;
  await prisma.devices.findUnique({
    where: {
      dev_id: deviceid
    },
    select: {
      dev_id: true,
      hos_id: true,
      group_id: true,
      dev_sn: true,
      dev_name: true,
      temp_min: true,
      temp_max: true,
      hum_min: true,
      hum_max: true,
      location_pic: true
    },
  }).then((result) => {
    if(!result){
      res.status(404).json({ status: 404, value : "Not Found!!" });
    }else{
      res.status(200).json({ status: 200, value : result });
    }
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const createDevice = async (req: Request, res: Response) => {
  const params: devices = req.body;
  await prisma.devices.create({
    data: params
  }).then((result) => {
    res.status(201).json({ status: 201, value : result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const updateDevice = async (req: Request, res: Response) => {
  const params: devices = req.body;
  const { deviceid } = req.params;
  await prisma.devices.update({
    where: {
      dev_id: deviceid,
    },
    data: params,
  }).then((result) => {
    res.status(200).json({ status: 200, value : result });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

const deleteDevice = async (req: Request, res: Response) => {
  const { deviceid } = req.params;
  await prisma.devices.delete({
    where: {
      dev_id: deviceid,
    },
  }).then((result) => {
    res.status(200).json({ status: 200, msg : "Delete Success!!" });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
};

export {
  getDevice,
  getDeviceByid,
  createDevice,
  updateDevice,
  deleteDevice
};