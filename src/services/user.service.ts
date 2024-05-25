import prisma from "../configs/prisma.config";
import { Users } from "@prisma/client";
import { getUserImage } from "../utils/image";
import fs from "node:fs";
import path from "node:path";
import { getDateFormat } from "../utils/format-date";
import { HttpError, NotFoundError } from "../error";

const getAllUser = async (): Promise<Users[]> => {
  try {
    const result = await prisma.users.findMany({
      include: {
        ward: {
          select: { wardName: true, hosId: true }
        }
      }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const getUserByUserId = async (userId: string): Promise<Users | null> => {
  try {
    const result = await prisma.users.findUnique({
      where: { userId: userId },
      include: {
        ward: {
          select: { wardName: true, hosId: true }
        }
      }
    });
    if (!result) throw new NotFoundError("Not Found!!");
    return result;
  } catch (error) {
    throw error;
  }
}

const editUser = async (userId: string, data: Users, pic?: Express.Multer.File): Promise<Users> => {
  try {
    const filename = await getUserImage(userId);
    data.userPic = !pic ? filename || null : `/img/user/${pic.filename}`;
    data.updateAt = getDateFormat(new Date());
    const result = await prisma.users.update({
      where: { userId: userId },
      data: data
    });
    if (pic && !!filename) fs.unlinkSync(path.join('public/images/user', filename.split("/")[3]));
    return result;
  } catch (error) {
    throw error;
  }
}

const delUser = async (userId: string): Promise<Users> => {
  try {
    const filename = await getUserImage(userId);
    const result = await prisma.users.delete({
      where: { userId: userId }
    });
    if (!!filename) fs.unlinkSync(path.join('public/images/user', filename.split("/")[3]));
    return result;
  } catch (error) {
    throw error;
  }
}


export { getAllUser, getUserByUserId, editUser, delUser };