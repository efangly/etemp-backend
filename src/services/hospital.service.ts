import { prisma } from "../configs";
import fs from "node:fs"
import path from "node:path";
import { v4 as uuidv4 } from 'uuid';
import { getHospitalImage, getDateFormat } from "../utils";
import { Hospitals } from "@prisma/client";
import { HttpError, NotFoundError } from "../error";
import { ResToken } from "../models";

const hospitalList = async (token: ResToken): Promise<Hospitals[]> => {
  try {
    if (token?.userLevel === "4") throw new HttpError(403, "Unable to receive information.");
    const result = await prisma.hospitals.findMany({ 
      where: token?.userLevel === "3" ? { hosId: token?.hosId } : {},
      include: { ward: true } 
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findHospital = async (hosId: string, token: ResToken): Promise<Hospitals | null> => {
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