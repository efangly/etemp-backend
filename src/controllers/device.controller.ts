import { NextFunction, Request, Response } from "express";
import fs from "node:fs"
import path from "node:path";
import { Devices } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { addDevice, deviceById, deviceList, editDevice, removeDevice } from "../services";
import { HttpError, ValidationError } from "../error";
import { BaseResponse } from "../utils/interface";
import { ZDevice, ZDeviceParam } from "../models";
import { fromZodError } from "zod-validation-error";
import { z } from "zod";

const getDevice = async (req: Request, res: Response<BaseResponse<Devices[]>>, next: NextFunction) => {
  //const { user_level, hos_id } = res.locals.token;
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await deviceList()
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
      data: await deviceById(params.devId, req.originalUrl.split("/")[3])
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
      data: await addDevice(body as unknown as Devices, req.file)
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

export default {
  getDevice,
  getDeviceByid,
  createDevice,
  updateDevice,
  deleteDevice
};