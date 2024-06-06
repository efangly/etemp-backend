import fs from "node:fs"
import path from "node:path";
import { NextFunction, Request, Response } from "express";
import { Hospitals } from "@prisma/client";
import { BaseResponse } from "../models";
import { HttpError, ValidationError } from "../error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { addHospital, editHospital, findHospital, hospitalList, removeHospital } from "../services";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";
import { ZHospital, ZHospitalParam } from "../models";

const getHospital = async (req: Request, res: Response<BaseResponse<Hospitals[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await hospitalList(res.locals.token)
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const getHospitalById = async (req: Request, res: Response<BaseResponse<Hospitals | null>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findHospital(params.hosId, res.locals.token)
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

const createHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const body = ZHospital.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addHospital(body as unknown as Hospitals, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/hospital', req.file.filename));
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const updateHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    const body = ZHospital.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editHospital(params.hosId, body as unknown as Hospitals, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/hospital', req.file.filename));
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

const deleteHospital = async (req: Request, res: Response<BaseResponse<Hospitals>>, next: NextFunction) => {
  try {
    const params = ZHospitalParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeHospital(params.hosId)
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
  getHospital,
  getHospitalById,
  createHospital,
  updateHospital,
  deleteHospital
};