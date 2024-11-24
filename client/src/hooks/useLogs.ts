import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import useAuth from './useAuth';
import { PAGINATION_LIMITS } from '../helpers/pagination';

interface LogEvent {
    id: number;
    timestamp: string;
    service: string;
    level: string;
    message: string;
    lineNumber: number;
}

interface MetaData {
    total: number;
    page: number;
    pages: number;
}

interface Filters {
    level: string;
    service: string;
    message: string;
    sortBy: string;
    order: string;
}

export const useLogs = (filters: Filters, refreshLogs: boolean) => {
    const [logs, setLogs] = useState<LogEvent[]>([]);
    const [meta, setMeta] = useState<MetaData>({ total: 0, page: 1, pages: 1 });
    const [loading, setLoading] = useState<boolean>(false);
    const { getAccessToken } = useAuth();

    const fetchLogs = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const response = await apiClient.get('/logs', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    page,
                    limit: PAGINATION_LIMITS.DEFAULT_PAGE_SIZE,
                    ...filters,
                },
            });

            if (response.data.meta.total > PAGINATION_LIMITS.MAX_PAGE_SIZE * 10) {
                console.warn('Large dataset detected, consider implementing data virtualization');
            }

            setLogs(response.data.data);
            setMeta(response.data.meta);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    }, [getAccessToken, filters]);

    useEffect(() => {
        fetchLogs(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, refreshLogs]);

    return { logs, meta, loading, fetchLogs };
};
