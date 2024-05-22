import { Notifications } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { BaseResponse } from "../utils/interface";
import { editNoti, notificationList, pushNotification } from "../services";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HttpError, ValidationError } from "../error";
import { ZNoti, ZNotiParam, ZTopic } from "../models";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const getNotification = async (req: Request, res: Response<BaseResponse<Notifications[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await notificationList()
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
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
      data: await editNoti(params.notiId, body as Notifications)
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

const setPushNotification = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    const params = ZTopic.parse(req.params);
    const result = await pushNotification(params);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: result ? "Push successful" : "Push fail"
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
  setToReadNoti,
  setPushNotification
};