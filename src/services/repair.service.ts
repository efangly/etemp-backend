import prisma from "../configs/prisma.config";
import { v4 as uuidv4 } from 'uuid';
import { Repairs } from "@prisma/client";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const repairList = async (): Promise<Repairs[]> => {
  try {
    return await prisma.repairs.findMany({ include: { device: true } });
  } catch (error) {
    throw error;
  }
}

const findRepair = async (repairId: string): Promise<Repairs | null> => {
  try {
    const result = await prisma.repairs.findUnique({ 
      where: { repairId: repairId },
      include: { device: true } 
    });
    if (!result) throw new NotFoundError(`Repair not found for : ${repairId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addRepair = async (body: Repairs) => {
  try {
    body.repairId = `RID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.repairs.create({
      data: body,
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const editRepair = async (repairId: string, body: Repairs) => {
  try {
    body.updateAt = getDateFormat(new Date());
    const result = prisma.repairs.update({
      where: { repairId: repairId },
      data: body
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeRepair = async (repairId: string) => {
  try {
    return await prisma.repairs.delete({ where: { repairId: repairId } });
  } catch (error) {
    throw error;
  }
}

export {
  repairList,
  findRepair,
  addRepair,
  editRepair,
  removeRepair
};
