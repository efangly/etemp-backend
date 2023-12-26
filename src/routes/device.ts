import { Router } from "express";
import { requireLogin } from "../middlewares/auth";
import { getDevice, getDeviceByid, createDevice, updateDevice, deleteDevice } from "../controllers/device.controller";
const DeviceRouter: Router = Router();

DeviceRouter.get('/', ...requireLogin(), getDevice);
DeviceRouter.get('/:deviceid', ...requireLogin(), getDeviceByid);
DeviceRouter.post('/', ...requireLogin(), createDevice);
DeviceRouter.put('/:deviceid', ...requireLogin(), updateDevice);
DeviceRouter.delete('/:deviceid', ...requireLogin(), deleteDevice);

export default DeviceRouter; 