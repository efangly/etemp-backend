import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import warranty from "../controllers/warranty.controller";

const warrantyRouter: Router = Router();

warrantyRouter.get('/', verifyToken, warranty.getWarranty);
warrantyRouter.get('/:warrId', verifyToken, warranty.getWarrantyById);
warrantyRouter.post('/', verifyToken, warranty.createWarranty);
warrantyRouter.put('/:warrId', verifyToken, warranty.updateWarranty);
warrantyRouter.delete('/:warrId', verifyToken, warranty.deleteWarranty);

export default warrantyRouter; 