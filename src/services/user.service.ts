import prisma from "../configs/prisma.config";
import { Users } from "@prisma/client";
import { getUserImage } from "../utils/image";
import fs from "node:fs";
import path from "node:path";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const getAllUser = async (): Promise<Users[]> => {
  try {
    const result = await prisma.users.findMany({
      select: {
        userId: true,
        wardId: true,
        userName: true,
        userStatus: true,
        userLevel: true,
        displayName: true,
        userPic: true,
        ward: {
          select: { wardName: true, hosId: true }
        }
      },
      orderBy: { userLevel: 'asc' }
    });
    return result as unknown as Users[];
  } catch (error) {
    throw error;
  }
}

const getUserByUserId = async (userId: string): Promise<Users | null> => {
  try {
    const result = await prisma.users.findUnique({
      where: { userId: userId },
      select: {
        userId: true,
        wardId: true,
        userName: true,
        userStatus: true,
        userLevel: true,
        displayName: true,
        userPic: true,
        ward: {
          select: { 
            wardName: true, 
            hosId: true, 
            hospital: {
              select: { hosName: true, hosPic: true }
            }
          },
        }
      }
    });
    if (!result) throw new NotFoundError("Not Found!!");
    return result as unknown as Users;
  } catch (error) {
    throw error;
  }
}

const editUser = async (userId: string, body: Users, pic?: Express.Multer.File): Promise<Users> => {
  try {
    const filename = await getUserImage(userId);
    body.userStatus = String(body.userStatus) == "1" ? true : false;
    body.userPic = !pic ? filename || null : `/img/user/${pic.filename}`;
    body.updateAt = getDateFormat(new Date());
    const result = await prisma.users.update({
      where: { userId: userId },
      data: body
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