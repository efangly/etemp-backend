import { Router } from "express";
import { register, checkLogin, changePassword } from "../controllers";
import { upload } from "../middlewares";
const authRouter = Router();

authRouter.post('/login', checkLogin);
authRouter.post('/register', upload.single('fileupload'), register);
authRouter.patch('/reset/:userId', changePassword);

export default authRouter;