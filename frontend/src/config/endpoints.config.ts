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
        country: import.meta.env.VITE_COUNTRY_API_URL,
        tourism: import.meta.env.VITE_TOURISM_API_URL,
        earthquake: import.meta.env.VITE_EARTHQUAKE_API_URL,
        volcano: import.meta.env.VITE_VOLCANO_API_URL
    },
    dev: {
        country: import.meta.env.VITE_LOCAL_API_URL,
        tourism: import.meta.env.VITE_LOCAL_API_URL,
        earthquake: import.meta.env.VITE_LOCAL_API_URL,
        volcano: import.meta.env.VITE_LOCAL_API_URL
    }
};

export const getEndpoints = (): ServiceEndpoints => {
    // Check if we're in production and validate all required env vars
    if (import.meta.env.PROD) {
        const requiredVars = {
            VITE_COUNTRY_API_URL: import.meta.env.VITE_COUNTRY_API_URL,
            VITE_TOURISM_API_URL: import.meta.env.VITE_TOURISM_API_URL,
            VITE_EARTHQUAKE_API_URL: import.meta.env.VITE_EARTHQUAKE_API_URL,
            VITE_VOLCANO_API_URL: import.meta.env.VITE_VOLCANO_API_URL,
        };
        console.log(requiredVars);
        const missingVars = Object.entries(requiredVars)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingVars.length > 0) {
            throw new Error(
                `Missing required environment variables: ${missingVars.join(', ')}\n` +
                `Current environment: ${JSON.stringify(import.meta.env, null, 2)}`
            );
        }
    }

    return import.meta.env.PROD ? endpoints.prod : endpoints.dev;
}; 