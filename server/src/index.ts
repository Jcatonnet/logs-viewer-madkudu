import express from 'express';
import cors from 'cors';
import checkJwt from './middleware/auth';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test-db', async (req, res) => {
    try {
        const logEvents = await prisma.logEvent.findMany();
        res.json(logEvents);
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ error: 'Database connection error' });
    }
});

app.use('/api', checkJwt);

app.get('/api/protected', (req, res) => {
    res.send('This is a protected route');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
