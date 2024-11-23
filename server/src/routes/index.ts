import { Router } from 'express';
import uploadRoutes from './uploadRoutes';
import checkJwt from '../middleware/auth';
import prisma from '../prisma/prisma';

const router = Router();

router.use(checkJwt);

router.use('/upload', uploadRoutes);

router.get('/protected', (req, res) => {
    res.send('This is a protected route');
});

router.get('/test-db', async (req, res) => {
    try {
        const logEvents = await prisma.logEvent.findMany();
        res.json(logEvents);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
});

export default router;
