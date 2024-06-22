import { Router } from "express";
import { verifyToken, upload } from "../middlewares";
import { getDevice, getDeviceByid, createDevice, updateDevice, deleteDevice } from "../controllers";
const deviceRouter: Router = Router();

deviceRouter.get('/', verifyToken, getDevice);
deviceRouter.get('/:devId', verifyToken, getDeviceByid);
deviceRouter.post('/', verifyToken, upload.single('fileupload'), createDevice);
deviceRouter.put('/:devId', verifyToken, upload.single('fileupload'), updateDevice);
deviceRouter.delete('/:devId', verifyToken, deleteDevice);

export default deviceRouter; 