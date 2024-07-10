import { Request, Response, NextFunction } from "express";
import { redisConn } from "../configs";

export const cachedData = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.originalUrl.split("/")[2];
  let keyName = "";
  if (res.locals.token.userLevel === "3") {
    keyName = `${path}:${res.locals.token.wardId}`;
  } else if (res.locals.token.userLevel === "2") {
    keyName = `${path}:${res.locals.token.hosId}`;
  } else {
    keyName = path;
  }
  const checkCachedData = await redisConn.get(keyName);
  if (checkCachedData) {
    return res.status(200).json({
      message: 'Successful',
      success: true,
      data: JSON.parse(checkCachedData),
    });
  } else {
    next();
  }
}
