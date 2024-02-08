import { Router } from "express";
import { requireLogin, verifyToken } from "../middlewares/auth";
import hospital from "../controllers/hospital.controller";

const GroupRouter: Router = Router();

GroupRouter.get('/', ...requireLogin(), verifyToken, hospital.getGroup);
GroupRouter.get('/:group_id', ...requireLogin(), verifyToken, hospital.getGroupById);
GroupRouter.post('/', ...requireLogin(), hospital.createGroup);
GroupRouter.put('/:group_id', ...requireLogin(), hospital.updateGroup);
GroupRouter.delete('/:group_id', ...requireLogin(), hospital.deleteGroup);

export default GroupRouter; 