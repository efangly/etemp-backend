import { Router } from "express";
import auth from "../controllers/auth.controller";
import upload from "../middlewares/uplodfile";
const AuthRouter: Router = Router();

AuthRouter.post('/login', auth.checkLogin);
AuthRouter.post('/register', upload.single('fileupload'), auth.register);

export default AuthRouter;