import { Router } from "express";
import { verifyToken } from "../middlewares";
import { createFirmware, deleteFirmware, getFirmwares } from "../controllers";
import upload from "../middlewares/uplodfile";
const firmwareRouter: Router = Router();

firmwareRouter.get('/', verifyToken, getFirmwares);
firmwareRouter.post('/', verifyToken, upload.single('fileupload'), createFirmware);
firmwareRouter.delete('/:filename', verifyToken, deleteFirmware);

export default firmwareRouter; 