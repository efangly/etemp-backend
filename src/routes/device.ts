import { Router } from "express";
import { verifyToken, upload, isSuperAdmin, isAdmin } from "../middlewares";
import { getDevice, getDeviceByid, createDevice, updateDevice, deleteDevice, changeSeq } from "../controllers";
const deviceRouter: Router = Router();

deviceRouter.get('/', verifyToken, getDevice);
deviceRouter.get('/:devId', verifyToken, getDeviceByid);
deviceRouter.post('/', verifyToken, isSuperAdmin, upload.single('fileupload'), createDevice);
deviceRouter.put('/:devId', verifyToken, isAdmin, upload.single('fileupload'), updateDevice);
deviceRouter.delete('/:devId', verifyToken, isSuperAdmin, deleteDevice);
deviceRouter.patch('/:devId/:afterDevId', verifyToken, changeSeq);

export default deviceRouter; 