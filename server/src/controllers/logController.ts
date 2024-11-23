import { Request, Response } from 'express';
import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';

type AggregationResult =
    | { group: string; levels: { [key: string]: number } }
    | { group: string; services: { [key: string]: number } };

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

export const getLogAggregation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupBy } = req.query;

        if (
            !groupBy ||
            !Object.values(Prisma.LogEventScalarFieldEnum).includes(groupBy as Prisma.LogEventScalarFieldEnum)
        ) {
            res.status(400).json({ error: 'Invalid groupBy parameter' });
            return;
        }

        let formattedData: AggregationResult[] = [];

        if (groupBy === 'service') {
            const services = await prisma.logEvent.groupBy({
                by: ['service'],
            });

            formattedData = await Promise.all(
                services.map(async (service) => {
                    const levels = await prisma.logEvent.groupBy({
                        by: ['level'],
                        where: { service: service.service },
                        _count: { id: true },
                    });

                    return {
                        group: service.service,
                        levels: levels.reduce((acc, level) => {
                            acc[level.level] = level._count.id;
                            return acc;
                        }, {} as { [key: string]: number }),
                    };
                })
            );
        } else if (groupBy === 'level') {
            const levels = await prisma.logEvent.groupBy({
                by: ['level'],
            });

            formattedData = await Promise.all(
                levels.map(async (level) => {
                    const services = await prisma.logEvent.groupBy({
                        by: ['service'],
                        where: { level: level.level },
                        _count: { id: true },
                    });

                    return {
                        group: level.level,
                        services: services.reduce((acc, service) => {
                            acc[service.service] = service._count.id;
                            return acc;
                        }, {} as { [key: string]: number }),
                    };
                })
            );
        } else if (groupBy === 'message') {
            const messages = await prisma.logEvent.groupBy({
                by: ['message'],
            });

            formattedData = await Promise.all(
                messages.map(async (message) => {
                    const levels = await prisma.logEvent.groupBy({
                        by: ['level'],
                        where: { message: message.message },
                        _count: { id: true },
                    });

                    return {
                        group: message.message,
                        levels: levels.reduce((acc, level) => {
                            acc[level.level] = level._count.id;
                            return acc;
                        }, {} as { [key: string]: number }),
                    };
                })
            );
        }

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching log aggregation:', error);
        res.status(500).json({ error: 'Error fetching log aggregation' });
    }
};
