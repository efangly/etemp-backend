import { Router } from "express";
import { requireLogin } from "../middlewares/auth";
import device from "../controllers/device.controller";
import repair from "../controllers/repair.controller";
import upload from "../middlewares/uplodfile";
const DeviceRouter: Router = Router();

DeviceRouter.get('/', ...requireLogin(), device.getDevice);
DeviceRouter.get('/:dev_id', ...requireLogin(), device.getDeviceByid);
DeviceRouter.post('/', ...requireLogin(), upload.single('fileupload'), device.createDevice);
DeviceRouter.put('/:dev_id', ...requireLogin(), upload.single('fileupload'), device.updateDevice);
DeviceRouter.patch('/:dev_id', device.adjustDevice);
DeviceRouter.delete('/:dev_id', ...requireLogin(), device.deleteDevice);

DeviceRouter.get('/repair', ...requireLogin(), repair.getRepair);
DeviceRouter.get('/repair/:repair_id', ...requireLogin(), repair.getRepairById);
DeviceRouter.put('/repair/:repair_id', ...requireLogin(), repair.updateRepair);
DeviceRouter.delete('/repair/:repair_id', ...requireLogin(), repair.deleteRepair);

export default DeviceRouter; 