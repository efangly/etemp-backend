import { NextFunction, Request, Response } from "express";
import { Repairs } from "@prisma/client";
import { BaseResponse } from "../models";
import { addRepair, editRepair, findRepair, removeRepair, repairList } from "../services/repair.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError, ValidationError } from "../error";
import { ZRepair, ZRepairParam } from "../models";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

const getRepair = async (req: Request, res: Response<BaseResponse<Repairs[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await repairList(res.locals.token)
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const getRepairById = async (req: Request, res: Response<BaseResponse<Repairs | null>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findRepair(params.repairId)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const createRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const body = ZRepair.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addRepair(body as Repairs)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const updateRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    const body = ZRepair.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editRepair(params.repairId, body as Repairs)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const deleteRepair = async (req: Request, res: Response<BaseResponse<Repairs>>, next: NextFunction) => {
  try {
    const params = ZRepairParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeRepair(params.repairId)
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

export default {
  getRepair,
  getRepairById,
  createRepair,
  updateRepair,
  deleteRepair
};
