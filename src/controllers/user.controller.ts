import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { getUserImage } from "../services/image";
import { Prisma, Users } from "@prisma/client";
import { getDateFormat } from "../services/formatdate";

const getUser = async (req: Request, res: Response) => {
  const { user_level, hos_id } = res.locals.token;
  const condition: Prisma.UsersWhereInput = getCondition(user_level,hos_id);
  if (user_level === '4') return res.status(403).json({ status: 403, error: 'Permission Denied!!!' });
  await prisma.users.findMany({
    where: condition,
    include: {
      ward: {
        include: {
          hospital: true
        }
      }
    }
  }).then((result) => {
    res.json({
      status: 200,
      value: result
    });
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const getUserById = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  const { user_level, hos_id } = res.locals.token;
  const condition: Prisma.UsersWhereInput = getCondition(user_level,hos_id);
  if (user_level === '4') return res.status(403).json({ status: 403, error: 'Permission Denied!!!' });
  await prisma.users.findMany({
    where: {
      AND: [
        { user_id: user_id },
        condition
      ]
    },
    include: {
      ward: {
        include: {
          hospital: true
        }
      }
    }
  }).then((result) => {
    if (result && result.length !== 0) {
      res.status(200).json({
        status: 200,
        value: result[0]
      });
    } else {
      res.status(404).json({
        status: 404,
        value: 'ไม่พบข้อมูลผู้ใช้งาน'
      });
    }
  }).catch((err) => {
    res.status(400).json({ error: err });
  });
}

const updateUser = async (req: Request, res: Response) => {
  const params: Users = req.body;
  const { user_id } = req.params;
  const file: string | undefined = req.file?.filename;
  try {
    const filename = await getUserImage(user_id);
    params.user_picture = req.file === undefined ? filename || null : `/img/user/${file}`;
    params.lastmodified = getDateFormat(new Date());
    const result: Users = await prisma.users.update({
      where: {
        user_id: user_id
      },
      data: params
    })
    if (req.file !== undefined && !!filename) {
      fs.unlinkSync(path.join('public/images/user', String(filename?.split("/")[3])));
    }
    res.json({
      status: 200,
      msg: 'Update Successful!!',
      value: result
    });
  } catch (err) {
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/user', String(file)));
    res.status(400).json({ error: err });
  }
}

const deleteUser = async (req: Request, res: Response) => {
  const { user_id } = req.params;
  try {
    const filename = await getUserImage(user_id);
    await prisma.users.delete({ where: { user_id: user_id } });
    if (!!filename) fs.unlinkSync(path.join('public/images/user', String(filename?.split("/")[3])));
    res.json({ status: 200, msg: 'Delete Successful!!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

const getCondition = (level: string, hos_id: string): Prisma.UsersWhereInput => {
  let whereCondition: Prisma.UsersWhereInput = {}
  switch(level){
    case "1":
      whereCondition = { user_level: { in: ['4', '3', '2', '1'] } }
      break;
    case "2":
      whereCondition = { user_level: { in: ['4', '3'] } }
      break;
    case "3":
      whereCondition = { user_level: '4', ward: { hos_id: hos_id } }
      break;
  }
  return whereCondition;
}

export default {
  getUser,
  getUserById,
  updateUser,
  deleteUser
};