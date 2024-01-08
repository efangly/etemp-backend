import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { logs_days } from "@prisma/client";

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
  const params = req.body;
  console.log(params)
  res.status(201).json({ status: 201, value : params });
  // await prisma.logs_days.create({
  //   data: params
  // }).then((result) => {
  //   res.status(201).json({ status: 201, value : result });
  // }).catch((err) => {
  //   res.status(400).json({ error: err });
  // });
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