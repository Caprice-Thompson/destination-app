import { getEndpoints, ServiceEndpoints } from './endpoints.config';

export interface ApiConfig {
    endpoints: ServiceEndpoints;
    useMockData: boolean;
}

const getApiConfig = (): ApiConfig => ({
    endpoints: getEndpoints(),
    useMockData: import.meta.env.VITE_USE_MOCK_DATA === 'false'
});

export const apiConfig = getApiConfig(); 