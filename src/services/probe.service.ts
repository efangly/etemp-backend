import { Probes } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';
import prisma from "../configs/prisma.config";
import { getDateFormat } from "../utils/format-date";
import { NotFoundError } from "../error";
import { ResToken } from "../models";

const probeList = async (token: ResToken): Promise<Probes[]> => {
  try {
    const result = await prisma.probes.findMany({
      where: token.userLevel === "4" ? { device: { wardId: token.wardId } } : 
      token.userLevel === "3" ? { device: { ward: { hosId: token.hosId } } } : {},
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const findProbe = async (probeId: string): Promise<Probes | null> => {
  try {
    const result = await prisma.probes.findUnique({
      where: { probeId: probeId },
      include: { device: true }
    });
    if (!result) throw new NotFoundError(`Probe not found for : ${probeId}`);
    return result;
  } catch (error) {
    throw error;
  }
}

const addProbe = async (body: Probes) => {
  try {
    body.probeId = `PID-${uuidv4()}`;
    body.createAt = getDateFormat(new Date());
    body.updateAt = getDateFormat(new Date());
    const result = prisma.probes.create({
      data: body,
      include: { device: true }
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const editProbe = async (probeId: string, body: Probes) => {
  try {
    body.updateAt = getDateFormat(new Date());
    const result = prisma.probes.update({
      where: { probeId: probeId },
      data: body
    });
    return result;
  } catch (error) {
    throw error;
  }
}

const removeProbe = async (probeId: string) => {
  try {
    return await prisma.probes.delete({ where: { probeId: probeId } });
  } catch (error) {
    throw error;
  }
}

export {
  probeList,
  findProbe,
  addProbe,
  editProbe,
  removeProbe
}