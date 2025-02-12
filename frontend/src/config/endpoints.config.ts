export interface ServiceEndpoints {
    country: string;
    tourism: string;
    earthquake: string;
    volcano: string;
}

interface EndpointConfig {
    prod: ServiceEndpoints;
    dev: ServiceEndpoints;
}

const endpoints: EndpointConfig = {
    prod: {
        country: import.meta.env.VITE_COUNTRY_API_URL || '',
        tourism: import.meta.env.VITE_TOURISM_API_URL || '',
        earthquake: import.meta.env.VITE_EARTHQUAKE_API_URL || '',
        volcano: import.meta.env.VITE_VOLCANO_API_URL || ''
    },
    dev: {
        country: import.meta.env.VITE_LOCAL_API_URL || '',
        tourism: import.meta.env.VITE_LOCAL_API_URL || '',
        earthquake: import.meta.env.VITE_LOCAL_API_URL || '',
        volcano: import.meta.env.VITE_LOCAL_API_URL || ''
    }
};

export const getEndpoints = (): ServiceEndpoints => {
    if (!import.meta.env.VITE_COUNTRY_API_URL) {
        console.warn('Environment variables not loaded properly');
    }
    return import.meta.env.PROD ? endpoints.prod : endpoints.dev;
}; 