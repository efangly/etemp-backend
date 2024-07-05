import { Router } from "express";
import { verifyToken, upload, isSuperAdmin } from "../middlewares";
import { getHospital, getHospitalById, createHospital, updateHospital, deleteHospital } from "../controllers";

const hospitalRouter: Router = Router();

hospitalRouter.get('/', verifyToken, isSuperAdmin, getHospital);
hospitalRouter.get('/:hosId', verifyToken, isSuperAdmin, getHospitalById);
hospitalRouter.post('/', verifyToken, isSuperAdmin, upload.single('fileupload'), createHospital);
hospitalRouter.put('/:hosId', verifyToken, isSuperAdmin, upload.single('fileupload'), updateHospital);
hospitalRouter.delete('/:hosId', verifyToken, isSuperAdmin, deleteHospital);

export default hospitalRouter;