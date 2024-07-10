import { prisma, redisConn } from "../configs";
import { Prisma, Users } from "@prisma/client";
import { getUserImage, getDateFormat } from "../utils";
import { NotFoundError } from "../error";
import type { ResToken } from "../models";
import fs from "node:fs";
import path from "node:path";

const getAllUser = async (token: ResToken): Promise<Users[]> => {
  try {
    let conditions: Prisma.UsersWhereInput | undefined = undefined;
    let keysName: string = "";
    switch (token.userLevel) {
      case "3":
        conditions = { wardId: token.wardId };
        keysName = `users:${token.wardId}`;
        break;
      case "2":
        conditions = { ward: { hosId: token.hosId } };
        keysName = `users:${token.hosId}`;
        break;
      default:
        conditions = undefined;
        keysName = "users";
    }
    // get cache
    const cachedData = await redisConn.get(keysName);
    if (cachedData) {
      return JSON.parse(cachedData) as unknown as Users[];
    }
    const result = await prisma.users.findMany({
      where: conditions,
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
    // set cache
    await redisConn.setEx(keysName, 3600, JSON.stringify(result));
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
    if (body.userStatus) body.userStatus = String(body.userStatus) == "1" ? true : false;
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