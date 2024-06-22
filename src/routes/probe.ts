import { Router } from "express";
import { verifyToken } from "../middlewares";
import { getProbe, getProbeById, createProbe, updateProbe, deleteProbe } from "../controllers";

const probeRouter: Router = Router();

probeRouter.get('/', verifyToken, getProbe);
probeRouter.get('/:probeId', verifyToken, getProbeById);
probeRouter.post('/', verifyToken, createProbe);
probeRouter.put('/:probeId', verifyToken, updateProbe);
probeRouter.delete('/:probeId', verifyToken, deleteProbe);

export default probeRouter; 