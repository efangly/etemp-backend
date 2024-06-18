import { Router } from "express";
import noti from "../controllers/notification.controller"; 
import { verifyToken } from "../middlewares";
const notiRouter: Router = Router();

notiRouter.get('/', verifyToken, noti.getNotification);
notiRouter.get('/:devSerial', verifyToken, noti.getNotificationByDevice);
notiRouter.patch('/:notiId', verifyToken, noti.setToReadNoti);
notiRouter.post('/', noti.setPushNotification);

export default notiRouter;