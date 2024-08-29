import { NextFunction, Request, Response, Router } from 'express';
import { backupData, getCompareDevice, getDevice } from '../controllers';
import { verifyToken } from '../middlewares';
import { BaseResponse } from '../models';
import { deviceEvent, historyList } from '../services';

const utilsRouter = Router();

utilsRouter.get('/backup', backupData);
utilsRouter.get('/compare', verifyToken, getCompareDevice);
utilsRouter.get('/device', getDevice);
utilsRouter.get('/history', verifyToken, async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    res.status(200).json({ 
      message: 'Successful',
      success: true, 
      data: await historyList(res.locals.token)
    });
  } catch (error) {
    next(error);
  }
});
utilsRouter.post('/mqtt', async (req: Request, res: Response<BaseResponse<Promise<string>>>, next: NextFunction) => {
  try {
    type EventDevice = {
      clientid: string,
      event: string
    };
    const data = req.body as EventDevice;
    res.status(200).json({ 
      message: 'Successful',
      success: true, 
      data: deviceEvent(data.clientid, data.event)
    });
  } catch (error) {
    next(error);
  }
});

export default utilsRouter;