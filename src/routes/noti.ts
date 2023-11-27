import { Router } from "express";
import { setPushNotification } from "../controllers/notification.controller"; 
const NotiRouter: Router = Router();

NotiRouter.post('/', setPushNotification);

export default NotiRouter;