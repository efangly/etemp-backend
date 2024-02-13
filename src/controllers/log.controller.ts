import e, { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { Logs_days } from "@prisma/client";
import { getDateFormat, getDistanceTime } from "../services/formatdate";

interface Filter {
  dev_id: string,
  send_time?: {
    gte: Date,
    lte?: Date
  }
}

const getLog = async (req: Request, res: Response) => {
  const { query } = req;
  let condition: Filter | undefined = filterLog(query);
  await prisma.logs_days.findMany({
    where: condition,
    orderBy: {
      send_time: 'desc'
    }
  }).then((result) => {
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
  const params: Logs_days | Logs_days[] = req.body;
  if(Array.isArray(params)){
    let logArr: Logs_days[] = [];
    params.forEach((log) => {
      logArr.push({
        log_id: `LOG-${uuidv4()}`,
        dev_id: log.dev_id,
        temp_value: log.temp_value,
        temp_avg: log.temp_avg,
        humidity_value: log.humidity_value,
        humidity_avg: log.humidity_avg,
        send_time: getDateFormat(log.send_time),
        ac: log.ac,
        door_1: log.door_1,
        door_2: log.door_2,
        door_3: log.door_3,
        internet: log.internet,
        probe: log.probe,
        battery: log.battery,
        ambient: log.ambient,
        insert_time: getDateFormat(new Date()),
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
    const value: Logs_days = {
      log_id: `LOG-${uuidv4()}`,
      dev_id: params.dev_id,
      temp_value: params.temp_value,
      temp_avg: params.temp_avg,
      humidity_value: params.humidity_value,
      humidity_avg: params.humidity_avg,
      send_time: getDateFormat(params.send_time),
      ac: params.ac,
      door_1: params.door_1,
      door_2: params.door_2,
      door_3: params.door_3,
      internet: params.internet,
      probe: params.probe,
      battery: params.battery,
      ambient: params.ambient,
      insert_time: getDateFormat(new Date()),
      sd_card: params.sd_card || null,
      event_counts: params.event_counts || null
    }
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

const filterLog = (query: any) => {
  if(query.dev_id){
    let condition: Filter = { dev_id: query.dev_id };
    if(query.filter){
      switch(query.filter){
        case 'day':
          condition.send_time = {
            gte: getDistanceTime('day')
          };
          break;
        case 'week':
          condition.send_time = {
            gte: getDistanceTime('week')
          };
          break;
        case 'month':
          condition.send_time = {
            gte: getDistanceTime('month')
          };
          break;
        default:
          condition.send_time = {
            gte: getDateFormat(new Date(query.filter.split(",")[0])),
            lte: getDateFormat(new Date(query.filter.split(",")[1])),
          };
      }
      return condition;
    }else{
      return condition;
    }
  }else{
    return undefined;
  }
}

export default {
  getLog,
  getLogById,
  createLog,
  deleteLog
};