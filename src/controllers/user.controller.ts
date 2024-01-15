import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { getUserImage } from "../services/image";
import { users } from "@prisma/client";

const getUser = async (req: Request, res: Response) => {
  const { user_level } = res.locals.token;
  await prisma.users.findMany({
    where: {
      user_level: user_level
    },
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
  await prisma.users.findUnique({
    where: {
      user_id: user_id
    },
    include: {
      ward: {
        include: {
          hospital: true
        }
      }
    }
  }).then((result) => {
    if (result) {
      res.status(200).json({
        status: 200,
        value: result
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
  const { user_name, display_name, user_status } = req.body;
  const { user_id } = req.params;
  const file: string | undefined = req.file?.filename;
  try {
    const filename = await getUserImage(user_id);
    let value = {
      user_name: user_name,
      display_name: display_name,
      user_status: user_status,
      user_picture: req.file === undefined ? filename : `/img/user/${file}`
    };
    const result: users = await prisma.users.update({
      where: {
        user_id: user_id
      },
      data: value
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
    await prisma.users.delete({ where: { user_id: user_id } })
    if (req.file !== undefined) fs.unlinkSync(path.join('public/images/user', String(filename?.split("/")[3])));
    res.json({ status: 200, msg: 'Delete Successful!!' });
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

export default {
  getUser,
  getUserById,
  updateUser,
  deleteUser
};