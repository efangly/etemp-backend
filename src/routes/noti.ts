import { Router } from "express";
import { setPushNotification } from "../controllers/notification.controller"; 
import { requireLogin } from "../controllers/auth.controller";
const NotiRouter: Router = Router();

NotiRouter.post('/', ...requireLogin(), setPushNotification);

export default NotiRouter;