import { Router } from 'express';
import upload from '../middleware/upload';
import { processCSV } from '../controllers/uploadController';

const router = Router();

router.post('/', upload.single('file'), processCSV);

export default router;
