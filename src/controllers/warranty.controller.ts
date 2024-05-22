import { NextFunction, Request, Response } from "express";
import { Warranties } from "@prisma/client";
import { BaseResponse } from "../utils/interface";
import { HttpError, ValidationError } from "../error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { addWarranty, editWarranty, findWarranty, removeWarranty, warrantyList } from "../services";
import { ZWarranty, ZWarrantyParam } from "../models";

const getWarranty = async (req: Request, res: Response<BaseResponse<Warranties[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await warrantyList()
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const getWarrantyById = async (req: Request, res: Response<BaseResponse<Warranties | null>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findWarranty(params.warrId)
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

const createWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const body = ZWarranty.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addWarranty(body as unknown as Warranties)
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

const updateWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    const body = ZWarranty.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editWarranty(params.warrId, body as unknown as Warranties)
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
 
const deleteWarranty = async (req: Request, res: Response<BaseResponse<Warranties>>, next: NextFunction) => {
  try {
    const params = ZWarrantyParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeWarranty(params.warrId)
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
  getWarranty,
  getWarrantyById,
  createWarranty,
  updateWarranty,
  deleteWarranty
};