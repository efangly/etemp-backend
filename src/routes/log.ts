import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import log from "../controllers/log.controller";
const logRouter: Router = Router();

logRouter.get('/', verifyToken, log.getLog);
logRouter.get('/:logId', verifyToken, log.getLogById);
logRouter.post('/', log.createLog);
logRouter.delete('/:logId', verifyToken, log.deleteLog);

export default logRouter;