import { useState, useEffect, useCallback } from 'react';
import { fetchAggregatedDataService } from '../services/logService';
import useAuth from './useAuth';

interface AggregatedData {
    group: string;
    levels?: { [key: string]: number };
    services?: { [key: string]: number };
}

export const useAggregatedData = (
    groupBy: string,
    refresh: boolean
): { data: AggregatedData[]; loading: boolean } => {
    const { getAccessToken } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAggregatedData = useCallback(async () => {
        setLoading(true);
        try {
            const token = await getAccessToken();
            const responseData = await fetchAggregatedDataService(groupBy, token);
            setData(responseData);
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
