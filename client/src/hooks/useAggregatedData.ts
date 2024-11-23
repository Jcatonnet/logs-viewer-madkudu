import { useState, useEffect, useCallback } from 'react';
import apiClient from '../services/apiClient';
import useAuth from './useAuth';

interface AggregatedData {
    group: string;
    levels?: { [key: string]: number };
    services?: { [key: string]: number };
}

export const useAggregatedData = (groupBy: string, refresh: boolean) => {
    const { getAccessToken } = useAuth();
    const [data, setData] = useState<AggregatedData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchAggregatedData = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const response = await apiClient.get('/logs/aggregate', {
                headers: { Authorization: `Bearer ${token}` },
                params: { groupBy },
            });
            setData(response.data || []);
        } catch (error) {
            console.error('Error fetching aggregated data:', error);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [getAccessToken, groupBy]);

    useEffect(() => {
        fetchAggregatedData();
    }, [fetchAggregatedData, refresh]);

    return { data, loading };
};
