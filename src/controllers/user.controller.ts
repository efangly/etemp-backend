import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";

const getUser = async (req: Request, res: Response) => {
  const { user_level } = res.locals.token;
  await prisma.users.findMany({
    where: {
      user_level: user_level
    }
  }).then((result) => {
    res.json({ 
      status: 200,
      value : result
    });
  }).catch((err) => {
    res.status(err.status).json({ error: err });
  });
}

const getUserById = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  await prisma.users.findUnique({
    where: { 
      user_id: user_id 
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
  if(req.file === undefined){
    res.status(400).json({ status: 400 ,message: "ไม่พบไฟล์รูป" })
  }else{
    const { user_name, display_name, user_status } = req.body;
    const { user_id, filename } = req.params;
    let file: string = req.file?.filename; 
    let value = {
      user_name: user_name,
      display_name: display_name,
      user_status: Number(user_status), 
      user_picture: `/images/${file}` 
    };
    await prisma.users.update({
      where: { 
        user_id : user_id 
      },
      data: value
    }).then((result) => {
      fs.unlinkSync(path.join('public/images', filename));
      res.json({ 
        status: 200,
        msg: 'Update Successful!!',
        value : result
      });
    }).catch((err) => {
      fs.unlinkSync(path.join('public/images', file));
      res.status(400).json({ error: err });
    });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const { user_id, filename } = req.params;
  await prisma.users.delete({
    where: { 
      user_id: user_id 
    }
  }).then((result) => {
    fs.unlinkSync(path.join('public/images', filename));
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