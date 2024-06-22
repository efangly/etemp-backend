import { Router } from "express";
import { verifyToken } from "../middlewares";
import { getConfig, updateConfig } from "../controllers";
const configRouter = Router();

configRouter.get('/:devSerial', getConfig);
configRouter.put('/:devSerial', verifyToken, updateConfig);

export default configRouter;