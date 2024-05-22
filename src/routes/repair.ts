import { Router } from "express";
import repair from "../controllers/repair.controller";
import { verifyToken } from "../middlewares/auth";
const repairRouter: Router = Router();

//user 
repairRouter.get('/', verifyToken, repair.getRepair);
repairRouter.get('/:repairId', verifyToken, repair.getRepairById);
repairRouter.post('/', verifyToken, repair.createRepair);
repairRouter.put('/:repairId', verifyToken, repair.updateRepair);
repairRouter.delete('/:repairId', verifyToken, repair.deleteRepair);

export default repairRouter;