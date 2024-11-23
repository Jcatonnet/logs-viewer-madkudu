import apiClient from './apiClient';

export const fetchAggregatedDataService = async (groupBy: string, token: string) => {
    const response = await apiClient.get('/logs/aggregate', {
        headers: { Authorization: `Bearer ${token}` },
        params: { groupBy },
    });
    return response.data || [];
};
