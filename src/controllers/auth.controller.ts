import { NextFunction, Request, Response } from "express";
import { BaseResponse } from "../utils/interface";
import { z } from "zod";
import {  fromZodError } from "zod-validation-error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { regisUser, resetPassword, userLogin } from "../services";
import { ResLogin, ZLogin, ZRegisUser, ZResetPass, ZUserParam } from "../models";
import { Users } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import { HttpError, ValidationError } from "../error";

const register = async (req: Request, res: Response<BaseResponse<Users>>, next: NextFunction) => {
  try {
    const body = ZRegisUser.parse(req.body);
    const pic = req.file;
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await regisUser(body, pic)
    });
  } catch (error) {
    if (req.file) fs.unlinkSync(path.join('public/images/user', String(req.file.filename)));
    if (error instanceof z.ZodError) {
      next(new ValidationError(fromZodError(error).toString()));
    } else if (error instanceof PrismaClientKnownRequestError) {
      next(new HttpError(400, `${error.name} : ${error.code}`));
    } else {
      next(error);
    }
  }
};

const checkLogin = async (req: Request, res: Response<BaseResponse<ResLogin>>, next: NextFunction) => {
  try {
    const login = ZLogin.parse(req.body);
    res.json({
      message: 'Successful',
      success: true,
      data: await userLogin(login)
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

const changePassword = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    const params = ZUserParam.parse(req.params);
    const body = ZResetPass.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: await resetPassword(body.password, params.userId)
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

export {
  checkLogin,
  register,
  changePassword
};