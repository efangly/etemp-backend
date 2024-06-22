import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import { getWarranty, getWarrantyById, createWarranty, updateWarranty, deleteWarranty } from "../controllers";

const warrantyRouter: Router = Router();

warrantyRouter.get('/', verifyToken, getWarranty);
warrantyRouter.get('/:warrId', verifyToken, getWarrantyById);
warrantyRouter.post('/', verifyToken, createWarranty);
warrantyRouter.put('/:warrId', verifyToken, updateWarranty);
warrantyRouter.delete('/:warrId', verifyToken, deleteWarranty);

export default warrantyRouter; 