import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares";
import { getConfig, updateConfig } from "../controllers";
const configRouter = Router();

configRouter.get('/:devSerial', getConfig);
configRouter.put('/:devSerial', verifyToken, isAdmin, updateConfig);

export default configRouter;