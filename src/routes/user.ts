import { Router } from "express";
import { getUser, getUserById, updateUser, deleteUser } from "../controllers/user.controller";
import { requireLogin } from "../controllers/auth.controller";
const UserRouter: Router = Router();

//user 
UserRouter.get('/', ...requireLogin(), getUser);
UserRouter.get('/:username', ...requireLogin(), getUserById);
UserRouter.put('/:username', ...requireLogin(), updateUser);
UserRouter.delete('/:username', ...requireLogin(), deleteUser);

export default UserRouter;