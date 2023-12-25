import { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { expressjwt, UnauthorizedError } from "express-jwt";
import prisma from "../configs/prisma.config";
import bcrypt from "bcrypt";

interface UserLogin {
  username: string,
  password: string
}

interface Regis {
  user_id: string
  hos_id: string
  user_name: string
  user_password: string,
  display_name: string
}

const register = async (req: Request, res: Response) => {
  const { user_id, hos_id, user_name, user_password, display_name }: Regis = req.body;
  const saltRounds = 10;
  bcrypt.hash(user_password, saltRounds, async (err, hash) => {
    const values: Regis = {
      user_id: user_id,
      hos_id: hos_id,
      user_name: user_name,
      user_password: hash,
      display_name: display_name
    } 
    await prisma.users.create({
      data: values
    }).then((result) => {
      res.status(201).json({ 
        status: 201,
        msg: "Create Suscess!!",
        data: result
      });
    }).catch((err) => {
      res.status(400).json({ error: err });
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
      hospital: true
    }
  }).then( async (result) => {
    if(result){
      const match = await bcrypt.compare(password, result.user_password);
      if(match){
        const userid: string = result.user_id;
        const hos_id: string = result.hos_id;
        const username: string = result.user_name;
        const display: string | null = result.display_name;
        const user_pic: string | null = result.user_picture;
        const user_level: number | null = result.user_level;
        const hos_picture: string | null = result.hospital.hos_picture;
        const hos_name: string | null = result.hospital.hos_name;
        const group_id: string | null = result.group_id;
        const user_status: string | null = result.user_status;
        const token: string = sign({ userid }, String(process.env.JWT_SECRET));
        return res.status(200).json({ token,userid, hos_id, username, display, user_pic, user_level, hos_picture, hos_name, group_id, user_status });
      }else{
        return res.status(400).json({ error: "รหัสผ่านไม่ถูกต้อง" })
      }
    }
    else{
      return res.status(400).json({ error: "ชื่อผู้ใช้ไม่ถูกต้อง" })
    }
  }).catch((err) => {
    res.status(400).json({ 
      msg: "ไม่สามารถเชื่อม Database ได้" ,
      error: err
    });
  });
};

const requireLogin = () => {
  return [
    expressjwt({
      secret: String(process.env.JWT_SECRET),
      algorithms: ["HS256"]
    }),(err: UnauthorizedError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status).json({
        status: err.status,
        msg: err.name,
        error: err.message,
      });
    }
  ]
}

export {
  checkLogin,
  register,
  requireLogin
};