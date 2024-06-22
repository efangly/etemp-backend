import { Router } from "express";
import { verifyToken, upload } from "../middlewares";
import { getHospital, getHospitalById, createHospital, updateHospital, deleteHospital } from "../controllers";

const hospitalRouter: Router = Router();

hospitalRouter.get('/', verifyToken, getHospital);
hospitalRouter.get('/:hosId', verifyToken, getHospitalById);
hospitalRouter.post('/', verifyToken, upload.single('fileupload'), createHospital);
hospitalRouter.put('/:hosId', verifyToken, upload.single('fileupload'), updateHospital);
hospitalRouter.delete('/:hosId', verifyToken, deleteHospital);

export default hospitalRouter;