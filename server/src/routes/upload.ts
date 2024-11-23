import { Router } from 'express';
import upload from '../middleware/upload';
import { processCSV } from '../controllers/uploadController';
import checkJwt from '../middleware/auth';

const router = Router();

router.post('/upload', checkJwt, upload.single('file'), processCSV);

export default router;
