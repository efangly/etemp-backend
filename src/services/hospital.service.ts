import prisma from "../configs/prisma.config";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getHospitalImage } from "../utils/image";
import { Hospitals } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const hospitalList = async (): Promise<Hospitals[]> => {
  try {
    const result = await prisma.hospitals.findMany({ 
      include: { ward: true } 
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findHospital = async (hosId: string): Promise<Hospitals | null> => {
  try {
    const result = await prisma.hospitals.findUnique({ 
      where: { hosId: hosId },
      include: { ward: true }  
    });
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

export {
  hospitalList,
  findHospital,
  addHospital,
  editHospital,
  removeHospital
};