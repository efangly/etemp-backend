import { Router } from "express";
import { isSuperAdmin, verifyToken } from "../middlewares/auth";
import { getWarranty, getWarrantyById, createWarranty, updateWarranty, deleteWarranty } from "../controllers";

const warrantyRouter: Router = Router();

warrantyRouter.get('/', verifyToken, getWarranty);
warrantyRouter.get('/:warrId', verifyToken, getWarrantyById);
warrantyRouter.post('/', verifyToken, isSuperAdmin, createWarranty);
warrantyRouter.put('/:warrId', verifyToken, isSuperAdmin, updateWarranty);
warrantyRouter.delete('/:warrId', verifyToken, isSuperAdmin, deleteWarranty);

export default warrantyRouter; 