import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import { getWard, getWardById, createWard, updateWard, deleteWard } from "../controllers";

const wardRouter: Router = Router();

wardRouter.get('/', verifyToken, getWard);
wardRouter.get('/:wardId', verifyToken, getWardById);
wardRouter.post('/', verifyToken, createWard);
wardRouter.put('/:wardId', verifyToken, updateWard);
wardRouter.delete('/:wardId', verifyToken, deleteWard);

export default wardRouter; 