import { Router } from "express";
import { deleteUser, getUser, getUserById, updateUser} from "../controllers";
import { verifyToken } from "../middlewares";
import upload from "../middlewares/uplodfile";

const userRouter: Router = Router();

//user 
userRouter.get('/', verifyToken, getUser);
userRouter.get('/:userId', verifyToken, getUserById);
userRouter.put('/:userId', verifyToken, upload.single('fileupload'), updateUser);
userRouter.delete('/:userId', verifyToken, deleteUser);

export default userRouter;