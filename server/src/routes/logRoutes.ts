import { Router } from 'express';
import { getLogAggregation, getLogs } from '../controllers/logController';

const router = Router();

router.get('/', getLogs);
router.get('/aggregate', getLogAggregation);

export default router;
