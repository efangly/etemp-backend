import { Router } from "express";
import { getRepair, getRepairById, createRepair, updateRepair, deleteRepair } from "../controllers";
import { verifyToken } from "../middlewares/auth";
const repairRouter: Router = Router();

//user 
repairRouter.get('/', verifyToken, getRepair);
repairRouter.get('/:repairId', verifyToken, getRepairById);
repairRouter.post('/', verifyToken, createRepair);
repairRouter.put('/:repairId', verifyToken, updateRepair);
repairRouter.delete('/:repairId', verifyToken, deleteRepair);

export default repairRouter;