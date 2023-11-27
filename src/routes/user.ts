import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { checkLogin, register, requireLogin } from "../controllers/auth.controller";
const UserRouter: Router = Router();

//user 
UserRouter.get('/', requireLogin, getUser);
UserRouter.post('/login', checkLogin);
UserRouter.post('/register', register);

export default UserRouter;