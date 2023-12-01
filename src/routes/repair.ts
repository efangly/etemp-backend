import { Router } from "express";
import repair from "../controllers/repair.controller";
import { requireLogin } from "../middlewares/auth";
const RepairRouter: Router = Router();

//user 
RepairRouter.get('/', ...requireLogin(), repair.getRepair);
RepairRouter.get('/:repairid', ...requireLogin(), repair.getRepairById);
RepairRouter.put('/:repairid', ...requireLogin(), repair.updateRepair);
RepairRouter.delete('/:repairid', ...requireLogin(), repair.deleteRepair);

export default RepairRouter;