import { Router } from "express";
import repair from "../controllers/repair.controller";
import { requireLogin, verifyToken } from "../middlewares/auth";
const RepairRouter: Router = Router();

//user 
RepairRouter.get('/', ...requireLogin(), verifyToken, repair.getRepair);
RepairRouter.get('/:repair_id', ...requireLogin(), verifyToken, repair.getRepairById);
RepairRouter.post('/', ...requireLogin(), repair.createRepair);
RepairRouter.put('/:repair_id', ...requireLogin(), repair.updateRepair);
RepairRouter.delete('/:repair_id', ...requireLogin(), repair.deleteRepair);

export default RepairRouter;