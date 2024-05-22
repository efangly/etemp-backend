import type { Request, Response } from 'express';
import { Router } from 'express';
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

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/device', deviceRouter);
router.use('/hospital', hospitalRouter);
router.use('/ward', wardRouter);
router.use('/probe', probeRouter);
router.use('/repair', repairRouter);
router.use('/warranty', warrantyRouter);
router.use('/notification', notiRouter);
router.use('/log', logRouter);

router.use('/', (req: Request, res: Response) => {
  res.json({ message: 'Home'});
});

export default router;