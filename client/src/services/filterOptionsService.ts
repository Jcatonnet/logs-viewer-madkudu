import apiClient from './apiClient';

export const fetchServices = async (token: string): Promise<string[]> => {
    const response = await apiClient.get('/logs/services', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
};

export const fetchLevels = async (token: string): Promise<string[]> => {
    const response = await apiClient.get('/logs/levels', {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data || [];
};
