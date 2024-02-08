import { Router } from "express";
import { requireLogin, verifyToken } from "../middlewares/auth";
import device from "../controllers/device.controller";
import upload from "../middlewares/uplodfile";
const DeviceRouter: Router = Router();

DeviceRouter.get('/', ...requireLogin(), verifyToken, device.getDevice);
DeviceRouter.get('/:dev_id', ...requireLogin(), verifyToken, device.getDeviceByid);
DeviceRouter.get('/adjust/:dev_id', device.getDeviceByid);
DeviceRouter.post('/', ...requireLogin(), upload.single('fileupload'), device.createDevice);
DeviceRouter.put('/:dev_id', ...requireLogin(), upload.single('fileupload'), device.updateDevice);
DeviceRouter.patch('/:dev_id', device.adjustDevice);
DeviceRouter.delete('/:dev_id', ...requireLogin(), device.deleteDevice);

export default DeviceRouter; 