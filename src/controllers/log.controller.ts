import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { logs_days } from "@prisma/client";
import { format, toDate } from "date-fns";

const getLog = async (req: Request, res: Response) => {
  await prisma.logs_days.findMany().then((result) => {
    res.json({ 
      status: 200,
      value : result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const getLogById = async (req: Request, res: Response) => {
  const { log_id } = req.params;
  await prisma.logs_days.findUnique({
    where: { 
      log_id: log_id 
    }
  }).then((result) => {
    if(result){
      res.status(200).json({ 
        status: 200,
        value : result
      });
    }else{
      res.status(404).json({ 
        status: 404,
        value : 'ไม่พบข้อมูล'
      });
    }
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const createLog = async (req: Request, res: Response) => {
  const params: logs_days | logs_days[] = req.body;
  if(Array.isArray(params)){
    let logArr: logs_days[] = [];
    params.forEach((log) => {
      logArr.push({
        log_id: `LOG-${uuidv4()}`,
        dev_id: log.dev_id,
        temp_value: log.temp_value,
        temp_avg: log.temp_avg,
        humidity_value: log.humidity_value,
        humidity_avg: log.humidity_avg,
        send_time: toDate(format(log.send_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")),
        ac: log.ac,
        door_1: log.door_1,
        door_2: log.door_2,
        door_3: log.door_3,
        internet: log.internet,
        probe: log.probe,
        battery: log.battery,
        ambient: log.ambient,
        insert_time: toDate(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")),
        sd_card: log.sd_card || null,
        event_counts: log.event_counts || null
      });
    });
    await prisma.logs_days.createMany({
      data: logArr
    }).then((result) => {
      res.status(201).json({ status: 201, msg : 'Create Success!!' });
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  }else{
    const value: logs_days = {
      log_id: `LOG-${uuidv4()}`,
      dev_id: params.dev_id,
      temp_value: params.temp_value,
      temp_avg: params.temp_avg,
      humidity_value: params.humidity_value,
      humidity_avg: params.humidity_avg,
      send_time: toDate(format(params.send_time, "yyyy-MM-dd'T'HH:mm:ss'Z'")),
      ac: params.ac,
      door_1: params.door_1,
      door_2: params.door_2,
      door_3: params.door_3,
      internet: params.internet,
      probe: params.probe,
      battery: params.battery,
      ambient: params.ambient,
      insert_time: toDate(format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'")),
      sd_card: params.sd_card || null,
      event_counts: params.event_counts || null
    }
    console.log(value)
    await prisma.logs_days.create({
      data: value
    }).then((result) => {
      res.status(201).json({ status: 201, msg : 'Create Success!!' });
    }).catch((err) => {
      res.status(400).json({ error: err });
    });
  }
};

const deleteLog = async (req: Request, res: Response) => {
  const { log_id } = req.params;
  await prisma.logs_days.delete({
    where: { 
      log_id: log_id 
    }
  }).then((result) => {
    res.json({ 
      status: 200,
      msg: 'Delete Successful!!',
      value : result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

export default {
  getLog,
  getLogById,
  createLog,
  deleteLog
};