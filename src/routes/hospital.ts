import { Router } from "express";
import { requireLogin, verifyToken } from "../middlewares/auth";
import hospital from "../controllers/hospital.controller";
import upload from "../middlewares/uplodfile";

const HospitalRouter: Router = Router();

HospitalRouter.get('/', ...requireLogin(), verifyToken, hospital.getHospital);
HospitalRouter.get('/:hos_id', ...requireLogin(), verifyToken, hospital.getHospitalById);
HospitalRouter.post('/',...requireLogin(), upload.single('fileupload'), hospital.createHospital);
HospitalRouter.put('/:hos_id', ...requireLogin(), upload.single('fileupload'), hospital.updateHospital);
HospitalRouter.delete('/:hos_id', ...requireLogin(), hospital.deleteHospital);

export default HospitalRouter;