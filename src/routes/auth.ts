import { Router } from "express";
import { checkLogin, register } from "../controllers/auth.controller";
const AuthRouter: Router = Router();

AuthRouter.post('/login', checkLogin);
AuthRouter.post('/register', register);

export default AuthRouter;