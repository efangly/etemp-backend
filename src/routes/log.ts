import { Router } from "express";
import { verifyToken } from "../middlewares";
import { getLog, getLogById, createLog, deleteLog } from "../controllers";
const logRouter: Router = Router();

logRouter.get('/', verifyToken, getLog);
logRouter.get('/:logId', verifyToken, getLogById);
logRouter.post('/', createLog);
logRouter.delete('/:logId', verifyToken, deleteLog);

export default logRouter;