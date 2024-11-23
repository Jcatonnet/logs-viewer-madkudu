import { Request, Response } from 'express';
import prisma from '../prisma/prisma';

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            cursor,
            limit = '25',
            sortBy = 'timestamp',
            order = 'desc',
            level,
            service,
            message,
        } = req.query;

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

        // Build the orderBy clause
        const orderField = sortBy as string;
        const orderDirection = order as string;

        // Build the pagination query
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const paginationQuery: any = {
            where,
            take: pageSize + 1, // Fetch one extra item to check if there's a next page
            orderBy: {
                [orderField]: orderDirection,
            },
        };

        // If cursor is provided, add it to the query
        if (cursor) {
            paginationQuery.cursor = {
                id: parseInt(cursor as string, 10),
            };
            paginationQuery.skip = 1; // Skip the cursor itself
        }

        // Execute the query
        const logs = await prisma.logEvent.findMany(paginationQuery);

        // Determine if there is a next page
        let nextCursor: number | null = null;
        if (logs.length > pageSize) {
            const nextItem = logs.pop(); // Remove the extra item
            nextCursor = nextItem?.id || null;
        }

        res.json({
            data: logs,
            meta: {
                nextCursor,
            },
        });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
};
