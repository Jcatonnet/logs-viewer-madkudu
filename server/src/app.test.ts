import request from 'supertest';
import { sign } from 'jsonwebtoken';
import app from './app';
import prisma from './prisma/prisma';
import { beforeAll, beforeEach, describe, it, expect } from '@jest/globals';
import dotenv from 'dotenv';


dotenv.config({ path: '.env.test' });

jest.mock('./middleware/auth', () => {
    return jest.fn((req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        next();
    });
});

describe('Logs API', () => {
    let authToken: string;

    beforeAll(() => {
        authToken = sign({ sub: 'test-user' }, process.env.JWT_SECRET || 'test-secret');
    });

    beforeEach(async () => {
        await prisma.logEvent.createMany({
            data: [
                {
                    timestamp: new Date('2024-01-01T12:00:00Z'),
                    service: 'TestService',
                    level: 'INFO',
                    message: 'Test message',
                    lineNumber: 1
                },
                {
                    timestamp: new Date('2024-01-01T12:01:00Z'),
                    service: 'TestService',
                    level: 'ERROR',
                    message: 'Error message',
                    lineNumber: 2
                }
            ]
        });
    });

    describe('GET /api/logs', () => {
        it('should return logs with pagination', async () => {
            const response = await request(app)
                .get('/api/logs')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(response.body.data).toHaveLength(2);
        });

        it('should filter by level', async () => {
            const response = await request(app)
                .get('/api/logs?level=ERROR')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body.data).toHaveLength(1);
            expect(response.body.data[0].level).toBe('ERROR');
        });

        it('should require authentication', async () => {
            await request(app)
                .get('/api/logs')
                .expect(401);
        });
    });
});