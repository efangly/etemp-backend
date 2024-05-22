import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import device from "../controllers/device.controller";
import upload from "../middlewares/uplodfile";
const deviceRouter: Router = Router();

deviceRouter.get('/', verifyToken, device.getDevice);
deviceRouter.get('/:devId', verifyToken, device.getDeviceByid);
deviceRouter.post('/', verifyToken, upload.single('fileupload'), device.createDevice);
deviceRouter.put('/:devId', verifyToken, upload.single('fileupload'), device.updateDevice);
deviceRouter.delete('/:devId', verifyToken, device.deleteDevice);

export default deviceRouter; 