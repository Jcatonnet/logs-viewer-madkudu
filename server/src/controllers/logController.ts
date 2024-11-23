import { Request, Response } from 'express';
import {
    getLogs as getLogsService,
    getLogAggregation as getLogAggregationService,
} from '../services/logService';

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

        const logsResult = await getLogsService({
            page: pageNumber,
            limit: pageSize,
            sortBy: sortBy as string,
            order: order as string,
            level: level as string | undefined,
            service: service as string | undefined,
            message: message as string | undefined,
        });

        res.json(logsResult);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ error: 'Error fetching logs' });
    }
};

export const getLogAggregation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { groupBy } = req.query;

        const groupByStr = groupBy as string;

        if (!groupByStr) {
            res.status(400).json({ error: 'Missing groupBy parameter' });
            return;
        }

        const formattedData = await getLogAggregationService(groupByStr);

        res.json(formattedData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Error fetching log aggregation:', error);
        if (error.message === 'Invalid groupBy parameter') {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'Error fetching log aggregation' });
        }
    }
};
