import type { NextFunction, Request, Response } from 'express';
import express, { Router } from 'express';
import authRouter from './auth';
import userRouter from './user';
import deviceRouter from './device';
import hospitalRouter from './hospital';
import wardRouter from './ward';
import probeRouter from './probe';
import repairRouter from './repair';
import warrantyRouter from './warranty';
import notiRouter from './noti';
import logRouter from './log';
import configRouter from './config';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import YAML from 'yaml';
import log from "../controllers/log.controller";
import { BaseResponse } from '../models';
import { historyList } from '../services';
import { verifyToken } from '../middlewares';

const file = fs.readFileSync("./swagger.yaml", "utf8");
const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/config', configRouter);
router.use('/hospital', hospitalRouter);
router.use('/ward', wardRouter);
router.use('/probe', probeRouter);
router.use('/repair', repairRouter);
router.use('/warranty', warrantyRouter);
router.use('/notification', notiRouter);
router.use('/log', logRouter);

router.use('/img', express.static('public/images'));
router.use('/font', express.static('public/fonts'));
router.use('/firmware', express.static('public/firmwares'));
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.parse(file)));
router.use('/backup', log.backupData);
router.use('/history', verifyToken, async (req: Request, res: Response<BaseResponse>, next: NextFunction) => {
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
router.use('/', (req: Request, res: Response<BaseResponse>) => {
  res.status(404).json({ 
    message: 'Not Found',
    success: false, 
    data: null
  });
});

export default router;