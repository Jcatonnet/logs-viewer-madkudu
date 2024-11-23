import express from 'express';
import cors from 'cors';
import checkJwt from './middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', checkJwt);

app.get('/api/protected', (req, res) => {
    res.send('This is a protected route');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
