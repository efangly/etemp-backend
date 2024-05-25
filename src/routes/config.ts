import { Router } from "express";
import device from "../controllers/device.controller";
const configRouter = Router();

configRouter.get('/:devId', device.getConfig);
configRouter.put('/:devId', device.updateConfig);

export default configRouter;