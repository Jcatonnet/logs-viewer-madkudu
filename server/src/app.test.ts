import request from 'supertest';
import { sign } from 'jsonwebtoken';
import { beforeAll, beforeEach, describe, it, expect } from '@jest/globals';

const mockPrisma = {
    logEvent: {
        findMany: jest.fn(),
        count: jest.fn(),
        createMany: jest.fn(),
        deleteMany: jest.fn(),
    },
};

jest.mock('./prisma/prisma', () => ({
    __esModule: true,
    default: mockPrisma
}));

jest.mock('./middleware/auth', () => {
    return jest.fn((req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No token provided' });
        }
        next();
    });
});

import app from './app';

describe('Logs API', () => {
    let authToken: string;

    beforeAll(() => {
        authToken = sign({ sub: 'test-user' }, process.env.JWT_SECRET || 'test-secret');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/logs', () => {
        const mockLogs = [
            {
                id: 1,
                timestamp: new Date('2024-01-01T12:00:00Z'),
                service: 'TestService',
                level: 'INFO',
                message: 'Test message',
                lineNumber: 1,
            },
            {
                id: 2,
                timestamp: new Date('2024-01-01T12:01:00Z'),
                service: 'TestService',
                level: 'ERROR',
                message: 'Error message',
                lineNumber: 2,
            },
        ];

        it('should return logs with pagination', async () => {
            mockPrisma.logEvent.findMany.mockResolvedValue(mockLogs);
            mockPrisma.logEvent.count.mockResolvedValue(2);

            const response = await request(app)
                .get('/api/logs')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200);

            expect(response.body).toHaveProperty('data');
            expect(response.body).toHaveProperty('meta');
            expect(response.body.data).toHaveLength(2);
            expect(mockPrisma.logEvent.findMany).toHaveBeenCalled();
        });

        it('should filter by level', async () => {
            const errorLog = mockLogs.filter(log => log.level === 'ERROR');
            mockPrisma.logEvent.findMany.mockResolvedValue(errorLog);
            mockPrisma.logEvent.count.mockResolvedValue(1);

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