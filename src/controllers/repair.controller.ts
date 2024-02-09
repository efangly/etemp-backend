import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { Repairs } from "@prisma/client";
import { getDateFormat } from "../services/formatdate";

const getRepair = async (req: Request, res: Response) => {
  await prisma.repairs.findMany().then((result) => {
    res.json({ 
      status: 200,
      value : result
    });
  }).catch((err) => {
    res.status(err.status).json({ error: err });
  });
}

const getRepairById = async (req: Request, res: Response) => {
  const { repairid } = req.params;
  await prisma.repairs.findUnique({
    where: { 
      repair_id: repairid 
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
    res.status(err.status).json({ error: err });
  });
}

const createRepair = async (req: Request, res: Response) => {
  const params: Repairs = req.body;
  params.repair_id = `REP-${uuidv4()}`;
  params.create_time = getDateFormat(new Date());
  params.lastmodified = getDateFormat(new Date());
  await prisma.repairs.create({
    data: params,
    include: {
      device: true
    }
  }).then((result) => {
    res.json({ 
      status: 200,
      msg: 'Create Successful!!',
      value : result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const updateRepair = async (req: Request, res: Response) => {
  const value: Repairs = req.body;
  const { repairid } = req.params;
  await prisma.repairs.update({
    where: { 
      repair_id : repairid 
    },
    data: value
  }).then((result) => {
    res.json({ 
      status: 200,
      msg: 'Update Successful!!',
      value : result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const deleteRepair = async (req: Request, res: Response) => {
  const { repairid } = req.params;
  await prisma.repairs.delete({
    where: { 
      repair_id: repairid 
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
  getRepair,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair
};
