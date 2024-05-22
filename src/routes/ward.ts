import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import ward from "../controllers/ward.controller";

const wardRouter: Router = Router();

wardRouter.get('/', verifyToken, ward.getWard);
wardRouter.get('/:wardId', verifyToken, ward.getWardById);
wardRouter.post('/', verifyToken, ward.createWard);
wardRouter.put('/:wardId', verifyToken, ward.updateWard);
wardRouter.delete('/:wardId', verifyToken, ward.deleteWard);

export default wardRouter; 