import { Router } from "express";
import noti from "../controllers/notification.controller"; 
import { requireLogin } from "../middlewares/auth";
const NotiRouter: Router = Router();

NotiRouter.get('/', ...requireLogin(), noti.getNotification);
NotiRouter.patch('/:noti_id', ...requireLogin(), noti.setToReadNoti);
NotiRouter.post('/', ...requireLogin(), noti.setPushNotification);

export default NotiRouter;