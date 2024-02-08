import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import fs from "node:fs";
import path from "node:path";
import prisma from "../configs/prisma.config";
import bcrypt from "bcrypt";
import { Users } from "@prisma/client";
import { getDateFormat } from "../services/formatdate";

interface UserLogin {
  username: string,
  password: string
}

const register = async (req: Request, res: Response) => {
  const params: Users = req.body;
  const saltRounds = 10;
  bcrypt.hash(params.user_password, saltRounds, async (err, hash) => {
    params.user_id = `UID-${uuidv4()}`,
    params.create_date = getDateFormat(new Date());
    params.lastmodified = getDateFormat(new Date());
    params.user_picture = req.file === undefined ? null : `/img/user/${req.file?.filename}`,
    params.user_password = hash;
    await prisma.users.create({
      data: params,
      include: {
        ward: {
          include: {
            hospital: true
          }
        }
      }
    }).then((result) => {
      res.status(201).json({
        status: 201,
        msg: "Create Suscess!!",
        data: result
      });
    }).catch((err) => {
      if (req.file !== undefined) fs.unlinkSync(path.join('public/images/user', String(req.file?.filename)))
      if(err instanceof PrismaClientKnownRequestError){
        res.status(400).json({ status: 400, error: err.code === 'P2002' ? 'ชื่อผู้ใช้ซ้ำ' : err });
      }else{
        res.status(400).json({ status: 400, error: err });
      }
    });
  });

};

const checkLogin = async (req: Request, res: Response) => {
  const { username, password }: UserLogin = req.body;
  await prisma.users.findUnique({
    where: {
      user_name: username
    },
    include: {
      ward: {
        include: {
          hospital: true
        }
      },
    }
  }).then(async (result) => {
    if (result) {
      const match = await bcrypt.compare(password, result.user_password);
      if (match) {
        const userid: string = result.user_id;
        const hos_id: string = result.ward.hospital.hos_id;
        const username: string = result.user_name;
        const display: string | null = result.display_name;
        const user_pic: string | null = result.user_picture;
        const user_level: string | null = result.user_level;
        const hos_picture: string | null = result.ward.hospital.hos_picture;
        const hos_name: string | null = result.ward.hospital.hos_name;
        const group_id: string | null = result.group_id;
        const user_status: string | null = result.user_status;
        const token: string = sign({ userid, user_level, hos_id }, String(process.env.JWT_SECRET));
        return res.status(200).json({ token, userid, hos_id, username, display, user_pic, user_level, hos_picture, hos_name, group_id, user_status });
      } else {
        return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" })
      }
    }
    else {
      return res.status(400).json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" })
    }
  }).catch((err) => {
    res.status(400).json({
      msg: "ไม่สามารถเชื่อม Database ได้",
      error: err
    });
  });
};

export default {
  checkLogin,
  register,
};