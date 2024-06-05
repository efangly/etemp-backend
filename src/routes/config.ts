import { Router } from "express";
import device from "../controllers/device.controller";
const configRouter = Router();

configRouter.get('/:devSerial', device.getConfig);
configRouter.put('/:devSerial', device.updateConfig);

export default configRouter;