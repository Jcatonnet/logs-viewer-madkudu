import { Router } from 'express';
import uploadRoutes from './uploadRoutes';
import checkJwt from '../middleware/auth';
import logRoutes from './logRoutes';

const router = Router();

router.use(checkJwt);

router.use('/upload', uploadRoutes);
router.use('/logs', logRoutes);

export default router;
