import { NextFunction, Request, Response } from "express";
import { BaseResponse } from "../models";
import { firmwareList, removeFirmware } from "../services";

const getFirmwares = (req: Request, res: Response<BaseResponse<string[]>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: firmwareList()
    });
  } catch (error) {
    next(error);
  }
}

const createFirmware = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: `Create file ${req.file?.originalname} success`
    });
  } catch (error) {
    next(error);
  }
};

const deleteFirmware = async (req: Request, res: Response<BaseResponse<string>>, next: NextFunction) => {
  try {
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: removeFirmware(req.params.filename)
    });
  } catch (error) {
    next(error);
  }
};

export {
  getFirmwares,
  createFirmware,
  deleteFirmware
}