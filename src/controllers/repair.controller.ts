import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { repairs } from "@prisma/client";

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

const updateRepair = async (req: Request, res: Response) => {
  const value: repairs = req.body;
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

export {
  getRepair,
  getRepairById,
  updateRepair,
  deleteRepair
};