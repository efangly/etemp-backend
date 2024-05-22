import { Router } from "express";
import { verifyToken } from "../middlewares/auth";
import probe from "../controllers/probe.controller";

const probeRouter: Router = Router();

probeRouter.get('/', verifyToken, probe.getProbe);
probeRouter.get('/:probeId', verifyToken, probe.getProbeById);
probeRouter.post('/', verifyToken, probe.createProbe);
probeRouter.put('/:probeId', verifyToken, probe.updateProbe);
probeRouter.delete('/:probeId', verifyToken, probe.deleteProbe);

export default probeRouter; 