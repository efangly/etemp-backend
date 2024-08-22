import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares";
import { getConfig, getConfigById, updateConfig } from "../controllers";
const configRouter = Router();

configRouter.get('/', getConfig);
configRouter.get('/:devSerial', getConfigById);
configRouter.put('/:devSerial', verifyToken, isAdmin, updateConfig);

export default configRouter;