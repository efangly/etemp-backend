import { NextFunction, Request, Response, Router } from 'express';
import { backupData, getCompareDevice, getDevice } from '../controllers';
import { verifyToken } from '../middlewares';
import { BaseResponse } from '../models';
import { addScheduleNotification, deviceEvent, historyList } from '../services';
import { z } from 'zod';
import { prisma } from '../configs';

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
utilsRouter.delete('/clearlog', verifyToken, async (_req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    await prisma.$transaction([
      prisma.logDaysBackup.deleteMany({
        where: { device: { ward: { hosId: "HID-DEVELOPMENT" } } }
      }),
      prisma.logDays.deleteMany({
        where: { device: { ward: { hosId: "HID-DEVELOPMENT" } } }
      }),
      prisma.notifications.deleteMany({
        where: { device: { ward: { hosId: "HID-DEVELOPMENT" } } }
      }),
      prisma.notificationsBackup.deleteMany({
        where: { device: { ward: { hosId: "HID-DEVELOPMENT" } } }
      })
    ]);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: "Delete log success"
    });
  } catch (error) {
    next(error);
  }
});
utilsRouter.post('/mqtt', async (req: Request, res: Response<BaseResponse<Promise<string>>>, next: NextFunction) => {
  try {
    const EventDevice = z.object({
      clientid: z.string(),
      event: z.string()
    });
    const data = EventDevice.parse(req.body);
    res.status(200).json({
      message: 'Successful',
      success: true,
      data: deviceEvent(data.clientid, data.event)
    });
  } catch (error) {
    next(error);
  }
});

utilsRouter.post('/schedule', async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
  try {
    res.status(201).json({
      message: 'Successful',
      success: true,
      data: await addScheduleNotification(req.body)
    });
  } catch (error) {
    next(error);
  }
});

export default utilsRouter;