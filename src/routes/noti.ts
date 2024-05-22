import { Router } from "express";
import noti from "../controllers/notification.controller"; 
import { verifyToken } from "../middlewares/auth";
const notiRouter: Router = Router();

notiRouter.get('/', verifyToken, noti.getNotification);
notiRouter.patch('/:notiId', verifyToken, noti.setToReadNoti);
notiRouter.post('/', verifyToken, noti.setPushNotification);

export default notiRouter;