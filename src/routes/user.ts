import { Router } from "express";
import { getUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { requireLogin,verifyToken } from "../middlewares/auth";
import upload from "../middlewares/uplodfile";

const UserRouter: Router = Router();

//user 
UserRouter.get('/', ...requireLogin(), verifyToken, getUser);
UserRouter.get('/:user_id', ...requireLogin(), getUserById);
UserRouter.put('/:user_id/:filename', ...requireLogin(), upload.single('fileupload'), updateUser);
UserRouter.delete('/:user_id/:filename', ...requireLogin(), deleteUser);

export default UserRouter;