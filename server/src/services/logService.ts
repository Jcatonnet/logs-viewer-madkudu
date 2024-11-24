import prisma from '../prisma/prisma';
import { Prisma } from '@prisma/client';

type AggregationResult =
    | { group: string; levels: { [key: string]: number } }
    | { group: string; services: { [key: string]: number } };

interface GetLogsParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
    level?: string;
    service?: string;
    message?: string;
}

export const getLogs = async (params: GetLogsParams) => {
    const {
        page = 1,
        limit = 25,
        sortBy = 'timestamp',
        order = 'desc',
        level,
        service,
        message,
    } = params;

    const pageNumber = page;
    const pageSize = limit;

    const where: Prisma.LogEventWhereInput = {};

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
            [sortBy]: order as Prisma.SortOrder,
        },
        select: {
            id: true,
            timestamp: true,
            service: true,
            level: true,
            message: true,
        },
    });

    return {
        data: logs,
        meta: {
            total: totalLogs,
            page: pageNumber,
            pages: Math.ceil(totalLogs / pageSize),
        },
    };
};

export const getLogAggregation = async (groupBy: string): Promise<AggregationResult[]> => {
    if (!['service', 'level', 'message'].includes(groupBy)) {
        throw new Error('Invalid groupBy parameter');
    }

    let formattedData: AggregationResult[] = [];

    if (groupBy === 'service') {
        const data = await prisma.logEvent.groupBy({
            by: ['service', 'level'],
            _count: { id: true },
            having: {
                id: {
                    _count: {
                        gt: 0,
                    },
                },
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 100,
        });

        const groupedData = data.reduce((acc, item) => {
            const service = item.service;
            const level = item.level;
            const count = item._count.id;

            if (!acc[service]) {
                acc[service] = { group: service, levels: {} };
            }
            acc[service].levels[level] = count;

            return acc;
        }, {} as { [key: string]: { group: string; levels: { [key: string]: number } } });

        formattedData = Object.values(groupedData);
    } else if (groupBy === 'level') {
        const data = await prisma.logEvent.groupBy({
            by: ['level', 'service'],
            _count: { id: true },
        });

        const groupedData = data.reduce((acc, item) => {
            const level = item.level;
            const service = item.service;
            const count = item._count.id;

            if (!acc[level]) {
                acc[level] = { group: level, services: {} };
            }
            acc[level].services[service] = count;

            return acc;
        }, {} as { [key: string]: { group: string; services: { [key: string]: number } } });

        formattedData = Object.values(groupedData);
    } else if (groupBy === 'message') {
        const data = await prisma.logEvent.groupBy({
            by: ['message'],
            _count: { id: true },
            orderBy: { _count: { id: 'desc' } },
            take: 10,
        });

        formattedData = data.map((item) => ({
            group: item.message,
            levels: { total: item._count.id },
        }));
    }

    return formattedData;
};

export const getUniqueServices = async (): Promise<string[]> => {
    const services = await prisma.logEvent.findMany({
        select: {
            service: true,
        },
        distinct: ['service'],
    });

    return services.map((item) => item.service);
};

export const getUniqueLevels = async (): Promise<string[]> => {
    const levels = await prisma.logEvent.findMany({
        select: {
            level: true,
        },
        distinct: ['level'],
    });

    return levels.map((item) => item.level);
};
