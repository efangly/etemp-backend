import { Router } from "express";
import { requireLogin } from "../middlewares/auth";
import log from "../controllers/log.controller";
const LogRouter: Router = Router();

LogRouter.get('/', ...requireLogin(), log.getLog);
LogRouter.get('/:log_id', ...requireLogin(), log.getLogById);
LogRouter.post('/', log.createLog);
LogRouter.delete('/:log_id', ...requireLogin(), log.deleteLog);

export default LogRouter; 