import { Request, Response } from "express";
import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getHospitalImage } from "../utils/image";
import { Wards, Hospitals } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
import { HttpError, NotFoundError } from "../error";

const hospitalList = async (): Promise<Hospitals[]> => {
  try {
    const result = await prisma.hospitals.findMany();
    return result;
  } catch (error) {
    throw error;
  }
}

const findHospital = async (hosId: string): Promise<Hospitals | null> => {
  try {
    const result = await prisma.hospitals.findUnique({ where: { hosId: hosId } });
    if (!result) throw new NotFoundError(`Hospital not found for : ${hosId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addHospital = async (body: Hospitals, pic?: Express.Multer.File): Promise<Hospitals> => {
  try {
    body.hosId = `HOS-${uuidv4()}`;
    body.hosPic = pic ? `/img/hospital/${pic.filename}` : null;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    return await prisma.hospitals.create({ data: body });
  } catch (error) {
    throw error;
  }
};

const editHospital = async (hosId: string, body: Hospitals, pic?: Express.Multer.File) => {
  try {
    const filename = await getHospitalImage(hosId);
    body.hosPic = pic ? `/img/hospital/${pic.filename}` : filename || null;
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.hospitals.update({
      where: { hosId: hosId },
      data: body
    })
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/hospital', filename.split("/")[3]));
    return result;
  } catch (error) {
    throw error;
  }
}

const removeHospital = async (hosId: string) => {
  try {
    const filename = await getHospitalImage(hosId);
    const result = await prisma.hospitals.delete({ where: { hosId: hosId } })
    if (!!filename) fs.unlinkSync(path.join('public/images/hospital', String(filename?.split("/")[3])));
    return result;
  } catch (error) {
    throw error;
  }
}

// /////////////////////////////////////////////////////////////////// WARD //////////////////////////////////////////////////////////////////////////////////

// const getGroup = async (req: Request, res: Response) => {
//   const { hos_id } = req.query;
//   await prisma.group.findMany({
//     where: hos_id ? { hos_id: String(hos_id) } : {},
//     include: {
//       hospital: true
//     }
//   }).then((result) => {
//     res.json({ status: 200, value: result });
//   }).catch((err) => {
//     res.status(400).json({ error: err });
//   });
// }

// const getGroupById = async (req: Request, res: Response) => {
//   const { group_id } = req.params;
//   await prisma.group.findUnique({
//     where: {
//       group_id: group_id
//     },
//     include: {
//       hospital: true
//     }
//   }).then((result) => {
//     res.json({ status: 200, value: result });
//   }).catch((err) => {
//     res.status(400).json({ error: err });
//   });
// }

// const createGroup = async (req: Request, res: Response) => {
//   const param: Group = req.body;
//   const value: Group = {
//     group_id: `WID-${uuidv4()}`,
//     group_name: param.group_name,
//     hos_id: param.hos_id
//   };
//   await prisma.group.create({
//     data: value,
//     include: {
//       hospital: true
//     }
//   }).then((result) => {
//     res.status(201).json({ status: 201, msg: 'Create Successful!!', value: result });
//   }).catch((err) => {
//     res.status(400).json({ error: err });
//   });
// }

// const updateGroup = async (req: Request, res: Response) => {
//   const { group_id } = req.params;
//   const param: Group = req.body;
//   await prisma.group.update({
//     where: {
//       group_id: group_id
//     },
//     data: param
//   }).then((result) => {
//     res.json({ status: 200, msg: 'Update Successful!!', value: result });
//   }).catch((err) => {
//     res.status(400).json({ error: err });
//   });
// }

// const deleteGroup = async (req: Request, res: Response) => {
//   const { group_id } = req.params;
//   await prisma.group.delete({
//     where: {
//       group_id: group_id
//     }
//   }).then((result) => {
//     res.json({ status: 200, msg: 'Delete Successful!!' });
//   }).catch((err) => {
//     res.status(400).json({ error: err });
//   });
// }

export {
  hospitalList,
  findHospital,
  addHospital,
  editHospital,
  removeHospital,
  // getGroup,
  // getGroupById,
  // createGroup,
  // updateGroup,
  // deleteGroup
};