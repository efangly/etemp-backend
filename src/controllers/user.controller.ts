import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import { users } from "@prisma/client";

const getUser = async (req: Request, res: Response) => {
  await prisma.users.findMany().then((result) => {
    res.json({ 
      status: 200,
      value : result
    });
  }).catch((err) => {
    res.status(err.status).json({ error: err });
  });
}

const getUserById = async (req: Request, res: Response) => {
  const { username } = req.params;
  await prisma.users.findUnique({
    where: { 
      user_name: username 
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
        value : 'ไม่พบข้อมูลผู้ใช้งาน'
      });
    }
  }).catch((err) => {
    res.status(err.status).json({ error: err });
  });
}

const updateUser = async (req: Request, res: Response) => {
  const value: users = req.body;
  const { username } = req.params;
  await prisma.users.update({
    where: { 
      user_name : username 
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

const deleteUser = async (req: Request, res: Response) => {
  const { username } = req.params;
  await prisma.users.delete({
    where: { 
      user_name: username 
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
  getUser,
  getUserById,
  updateUser,
  deleteUser
};