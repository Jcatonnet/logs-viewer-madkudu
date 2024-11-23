import { useState, useEffect } from 'react';
import { fetchServices, fetchLevels } from '../services/filterOptionsService';
import useAuth from './useAuth';

export const useFilterOptions = () => {
    const [serviceOptions, setServiceOptions] = useState<string[]>([]);
    const [levelOptions, setLevelOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { getAccessToken } = useAuth();

    useEffect(() => {
        const fetchOptions = async () => {
            setLoading(true);
            try {
                const token = await getAccessToken();

                const [services, levels] = await Promise.all([
                    fetchServices(token),
                    fetchLevels(token),
                ]);

                setServiceOptions(services);
                setLevelOptions(levels);
            } catch (error) {
                console.error('Error fetching filter options:', error);
                setServiceOptions([]);
                setLevelOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchOptions();
    }, [getAccessToken]);

    return { serviceOptions, levelOptions, loading };
};
