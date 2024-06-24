import { Request, Response, NextFunction } from "express";

const checkCache = (req: Request, res: Response, next: NextFunction) => {
  next();
}

export {
  checkCache
}