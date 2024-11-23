import { Router } from 'express';
import { getLevels, getLogAggregation, getLogs, getServices } from '../controllers/logController';

const router = Router();

router.get('/', getLogs);
router.get('/aggregate', getLogAggregation);
router.get('/services', getServices);
router.get('/levels', getLevels);

export default router;
