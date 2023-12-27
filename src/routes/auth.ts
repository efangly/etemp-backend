import { Router } from "express";
import { checkLogin, register } from "../controllers/auth.controller";
import upload from "../middlewares/uplodfile";
const AuthRouter: Router = Router();

AuthRouter.post('/login', checkLogin);
AuthRouter.post('/register', upload.single('fileupload'), register);

export default AuthRouter;