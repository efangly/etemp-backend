import { Warranties } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../configs/prisma.config";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const warrantyList = async (): Promise<Warranties[]> => {
  try {
    const result = await prisma.warranties.findMany({
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findWarranty = async (warrId: string): Promise<Warranties | null> => {
  try {
    const result = await prisma.warranties.findUnique({
      where: { warrId: warrId },
      include: { device: true }
    });
    if (!result) throw new NotFoundError(`Warranty not found for : ${warrId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addWarranty = async (body: Warranties) => {
  try {
    body.warrId = `CID-${uuidv4()}`;
    body.expire = getDateFormat(body.expire);
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.warranties.create({
      data: body,
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const editWarranty = async (warrId: string, body: Warranties) => {
  try {
    body.expire = getDateFormat(body.expire);
    body.updateAt = getDateFormat(new Date());
    const result = prisma.warranties.update({
      where: { warrId: warrId },
      data: body
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeWarranty = async (warrId: string) => {
  try {
    return await prisma.warranties.delete({ where: { warrId: warrId } });
  } catch (error) {
    throw error;
  }
}

export {
  warrantyList,
  findWarranty,
  addWarranty,
  editWarranty,
  removeWarranty
}
