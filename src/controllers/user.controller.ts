import { Request, Response } from "express";
import dotenv from "dotenv";
import prisma from "../configs/prisma.config";
//import { users } from "@prisma/client";
dotenv.config();

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

export {
  getUser
};