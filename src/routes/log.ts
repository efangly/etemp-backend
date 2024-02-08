import { Router } from "express";
import { requireLogin, verifyToken } from "../middlewares/auth";
import log from "../controllers/log.controller";
const LogRouter: Router = Router();

LogRouter.get('/', ...requireLogin(), verifyToken, log.getLog);
LogRouter.get('/:log_id', ...requireLogin(), verifyToken, log.getLogById);
LogRouter.post('/', log.createLog);
LogRouter.delete('/:log_id', ...requireLogin(), log.deleteLog);

export default LogRouter; 