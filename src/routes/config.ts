import { Router } from "express";
import { verifyToken } from "../middlewares";
import device from "../controllers/device.controller";
const configRouter = Router();

configRouter.get('/:devSerial', device.getConfig);
configRouter.put('/:devSerial', verifyToken, device.updateConfig);

export default configRouter;