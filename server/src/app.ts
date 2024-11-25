
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config();

const app = express();

app.use(
    cors({
        origin: ['http://localhost:5173', 'https://logs-viewer-madkudu-fe.vercel.app'],
        credentials: true,
    })
);

app.use(express.json());

app.use('/api', routes);

export default app;