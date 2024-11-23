import { Request, Response } from 'express';
import prisma from '../prisma/prisma';

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            page = '1',
            limit = '25',
            sortBy = 'timestamp',
            order = 'desc',
            level,
            service,
            message,
        } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const pageSize = parseInt(limit as string, 10);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const where: any = {};

        if (level) {
            where.level = level;
        }

        if (service) {
            where.service = {
                contains: service,
                mode: 'insensitive',
            };
        }

        if (message) {
            where.message = {
                contains: message,
                mode: 'insensitive',
            };
        }

        const totalLogs = await prisma.logEvent.count({ where });

        const logs = await prisma.logEvent.findMany({
            where,
            skip: (pageNumber - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortBy as string]: order as string,
            },
        });

        res.json({
            data: logs,
            meta: {
                total: totalLogs,
                page: pageNumber,
                pages: Math.ceil(totalLogs / pageSize),
            },
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
};
