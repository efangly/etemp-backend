import { Request, Response, NextFunction } from "express"
import { expressjwt, UnauthorizedError } from "express-jwt";
import { verify } from "jsonwebtoken";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try{
    const token: string | undefined = req.headers.authorization!.split(" ")[1];
    const decoded = verify(String(token), String(process.env.JWT_SECRET));
    res.locals.token = decoded;
    next();
  }catch(error){
    res.status(401).json({ status: 401, message: "Invalid token" });
  }
}

const requireLogin = () => {
  return [
    expressjwt({
      secret: String(process.env.JWT_SECRET),
      algorithms: ["HS256"]
    }),(err: UnauthorizedError, req: Request, res: Response, next: NextFunction) => {
      res.status(err.status).json({
        status: err.status,
        msg: err.name,
        error: err.message,
      });
    }
  ]
}

export {
  verifyToken,
  requireLogin
};