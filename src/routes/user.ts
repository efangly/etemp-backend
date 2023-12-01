import { Router } from "express";
import user from "../controllers/user.controller";
import { requireLogin,verifyToken } from "../middlewares/auth";
import upload from "../middlewares/uplodfile";

const UserRouter: Router = Router();

//user 
UserRouter.get('/', ...requireLogin(), verifyToken, user.getUser);
UserRouter.get('/:user_id', ...requireLogin(), user.getUserById);
UserRouter.put('/:user_id', ...requireLogin(), upload.single('fileupload'), user.updateUser);
UserRouter.delete('/:user_id', ...requireLogin(), user.deleteUser);

export default UserRouter;