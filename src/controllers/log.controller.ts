import { NextFunction, Request, Response } from "express";
import { LogDays } from "@prisma/client";
import { BaseResponse } from "../models";
import { ZLogParam, ZQueryLog } from "../models";
import { z } from "zod";
import { logList, findLog, addLog, removeLog, backupLog } from "../services";
import { fromZodError } from "zod-validation-error";
import { HttpError, ValidationError } from "../error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const getLog = async (req: Request, res: Response<BaseResponse<LogDays[]>>, next: NextFunction) => {
  try {
    const query = ZQueryLog.parse(req.query);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await logList(query)
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

const getLogById = async (req: Request, res: Response<BaseResponse<LogDays>>, next: NextFunction) => {
  try {
    const params = ZLogParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findLog(params.logId)
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

const createLog = async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addLog(req.body)
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const deleteLog = async (req: Request, res: Response<BaseResponse<LogDays>>, next: NextFunction) => {
  try {
    const params = ZLogParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeLog(params.logId)
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

const backupData = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await backupLog()
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
}

export default {
  getLog,
  getLogById,
  createLog,
  deleteLog,
  backupData
};