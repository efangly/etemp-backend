import { NextFunction, Request, Response } from "express";
import fs from "node:fs"
import path from "node:path";
import { Configs, Devices } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { addDevice, deviceById, deviceList, editConfig, editDevice, findConfig, removeDevice } from "../services";
import { HttpError, ValidationError } from "../error";
import { BaseResponse } from "../utils/interface";
import { TDevice, ZConfig, ZConfigParam, ZDevice, ZDeviceParam } from "../models";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

const getDevice = async (req: Request, res: Response<BaseResponse<Devices[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceList(res.locals.token)
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};
 
const getDeviceByid = async (req: Request, res: Response<BaseResponse<Devices | null>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceById(params.devId)
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
};

const createDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const body = ZDevice.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addDevice(body as unknown as TDevice, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/device', req.file.filename));
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const updateDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    const body = ZDevice.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editDevice(params.devId, body as unknown as Devices, req.file)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/device', req.file.filename));
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const deleteDevice = async (req: Request, res: Response<BaseResponse<Devices>>, next: NextFunction) => {
  try {
    const params = ZDeviceParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await removeDevice(params.devId)
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
};

const getConfig = async (req: Request, res: Response<BaseResponse<Devices | null>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findConfig(params.devSerial)
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
};

const updateConfig = async (req: Request, res: Response<BaseResponse<Configs>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    const body = ZConfig.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editConfig(params.devSerial, body as unknown as Configs)
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
};

export default {
  getDevice,
  getDeviceByid,
  createDevice,
  updateDevice,
  deleteDevice,
  getConfig,
  updateConfig
};