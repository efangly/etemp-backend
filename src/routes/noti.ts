import { Router } from "express";
import noti from "../controllers/notification.controller"; 
import { verifyToken } from "../middlewares/auth";
const notiRouter: Router = Router();

notiRouter.get('/', verifyToken, noti.getNotification);
notiRouter.get('/:devId', verifyToken, noti.getNotificationByDevice);
notiRouter.patch('/:notiId', verifyToken, noti.setToReadNoti);
notiRouter.post('/', noti.setPushNotification);

export default notiRouter;