import { Router } from "express";
import { register, checkLogin } from "../controllers";
import upload from "../middlewares/uplodfile";
const authRouter = Router();

authRouter.post('/login', checkLogin);
authRouter.post('/register', upload.single('fileupload'), register);

export default authRouter;