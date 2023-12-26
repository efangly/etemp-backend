import { Router } from "express";
import { setPushNotification } from "../controllers/notification.controller"; 
import { requireLogin } from "../middlewares/auth";
const NotiRouter: Router = Router();

NotiRouter.post('/', ...requireLogin(), setPushNotification);

export default NotiRouter;