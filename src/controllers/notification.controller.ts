import { Notifications } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BaseResponse, ZConfigParam } from "../models";
import { addNotification, editNotification, findNotification, notificationList } from "../services";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError, ValidationError } from "../error";
import { ZDeviceParam, ZNoti, ZNotiParam } from "../models";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const getNotification = async (req: Request, res: Response<BaseResponse<Notifications[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await notificationList(res.locals.token)
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const getNotificationByDevice = async (req: Request, res: Response<BaseResponse<Notifications[]>>, next: NextFunction) => {
  try {
    const params = ZConfigParam.parse(req.params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await findNotification(params.devSerial)
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

const setToReadNoti = async (req: Request, res: Response<BaseResponse<Notifications>>, next: NextFunction) => {
  try {
    const params = ZNotiParam.parse(req.params);
    const body = ZNoti.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await editNotification(params.notiId, body as Notifications)
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

const setPushNotification = async (req: Request, res: Response<BaseResponse<Notifications>>, next: NextFunction) => {
  try {
    const body = ZNoti.parse(req.body);
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addNotification(body as Notifications)
    });
  } catch(error) {
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
  getNotification,
  getNotificationByDevice,
  setToReadNoti,
  setPushNotification
};