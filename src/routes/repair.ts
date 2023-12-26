import { Router } from "express";
import { getRepair, getRepairById, updateRepair, deleteRepair } from "../controllers/repair.controller";
import { requireLogin } from "../middlewares/auth";
const RepairRouter: Router = Router();

//user 
RepairRouter.get('/', ...requireLogin(), getRepair);
RepairRouter.get('/:repairid', ...requireLogin(), getRepairById);
RepairRouter.put('/:repairid', ...requireLogin(), updateRepair);
RepairRouter.delete('/:repairid', ...requireLogin(), deleteRepair);

export default RepairRouter;