import { Wards } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../configs/prisma.config";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";

const wardList = async (): Promise<Wards[]> => {
  try {
    const result = await prisma.wards.findMany({
      include: { hospital: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findWard = async (wardId: string): Promise<Wards | null> => {
  try {
    const result = await prisma.wards.findUnique({
      where: { wardId: wardId },
      include: { hospital: true }
    });
    if (!result) throw new NotFoundError(`Ward not found for : ${wardId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addWard = async (body: Wards) => {
  try {
    const seq: Wards[] = await wardList();
    body.wardId = `WID-${uuidv4()}`;
    body.wardSeq = seq.length === 0 ? 1 : seq[seq.length - 1].wardSeq + 1;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.wards.create({
      data: body,
      include: { hospital: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const editWard = async (wardId: string, body: Wards) => {
  try {
    body.updateAt = getDateFormat(new Date());
    const result = prisma.wards.update({
      where: { wardId: wardId },
      data: body
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeWard = async (wardId: string) => {
  try {
    return await prisma.wards.delete({ where: { wardId: wardId } });
  } catch (error) {
    throw error;
  }
}

export {
  wardList,
  findWard,
  addWard,
  editWard,
  removeWard
}
