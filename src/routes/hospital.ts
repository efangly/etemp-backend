import { Router } from "express";
import { requireLogin } from "../middlewares/auth";
import hospital from "../controllers/hospital.controller";
import upload from "../middlewares/uplodfile";

const HospitalRouter: Router = Router();

HospitalRouter.get('/', ...requireLogin(), hospital.getHospital);
HospitalRouter.get('/:hos_id', ...requireLogin(), hospital.getHospitalById);
HospitalRouter.post('/',...requireLogin(), upload.single('fileupload'), hospital.createHospital);
HospitalRouter.put('/:hos_id', ...requireLogin(), upload.single('fileupload'), hospital.updateHospital);
HospitalRouter.delete('/:hos_id', ...requireLogin(), hospital.deleteHospital);

HospitalRouter.get('/group', ...requireLogin(), hospital.getGroup);
HospitalRouter.get('/group/:group_id', ...requireLogin(), hospital.getGroupById);
HospitalRouter.post('/group', ...requireLogin(), hospital.createGroup);
HospitalRouter.put('/group/:group_id', ...requireLogin(), hospital.updateGroup);
HospitalRouter.delete('/group/:group_id', ...requireLogin(), hospital.deleteGroup);

export default HospitalRouter; 