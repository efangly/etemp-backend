import { Router } from "express";
import noti from "../controllers/notification.controller"; 
import { requireLogin } from "../middlewares/auth";
const NotiRouter: Router = Router();

NotiRouter.get('/', ...requireLogin(), noti.getNotification);
NotiRouter.post('/', ...requireLogin(), noti.setPushNotification);

export default NotiRouter;