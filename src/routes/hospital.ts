import { Router } from "express";
import { verifyToken } from "../middlewares";
import hospital from "../controllers/hospital.controller";
import upload from "../middlewares/uplodfile";

const hospitalRouter: Router = Router();

hospitalRouter.get('/', verifyToken, hospital.getHospital);
hospitalRouter.get('/:hosId', verifyToken, hospital.getHospitalById);
hospitalRouter.post('/', verifyToken, upload.single('fileupload'), hospital.createHospital);
hospitalRouter.put('/:hosId', verifyToken, upload.single('fileupload'), hospital.updateHospital);
hospitalRouter.delete('/:hosId', verifyToken, hospital.deleteHospital);

export default hospitalRouter;