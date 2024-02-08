import { Router } from "express";
import repair from "../controllers/repair.controller";
import { requireLogin, verifyToken } from "../middlewares/auth";
const RepairRouter: Router = Router();

//user 
RepairRouter.get('/', ...requireLogin(), verifyToken, repair.getRepair);
RepairRouter.get('/:repairid', ...requireLogin(), verifyToken, repair.getRepairById);
RepairRouter.put('/:repairid', ...requireLogin(), repair.updateRepair);
RepairRouter.delete('/:repairid', ...requireLogin(), repair.deleteRepair);

export default RepairRouter;