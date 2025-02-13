export class AppError extends Error {
    constructor(public statusCode: number, message: string, public detail?: string) {
        super(message);
    }

    errorHandler(error: Error) {
        if (error instanceof AppError) {
            return {
                statusCode: error.statusCode,
                body: JSON.stringify({ message: error.message, detail: this.detail })
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: process.env.NODE_ENV === 'production'
                    ? 'Internal server error'
                    : error.message
            })
        };
    };
}

type RequestOptions = {
    method?: string;
    headers?: Record<string, string>;
    body?: string | URLSearchParams;
    mode?: string;
};

export async function getData<T>(
    url: string,
    options?: RequestOptions
): Promise<T | void> {
    const defaultOptions: RequestOptions = {
        method: "GET",

        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...options?.headers,
        },
        ...options,
    };
    try {
        const response = await fetch(url, defaultOptions as RequestInit);
        if (!response.ok) {
            throw new AppError(
                response.status,
                `HTTP error! Status: ${response.status}: ${JSON.stringify(
                    response.body
                )}`
            );
        }
        const data: T = await response.json();
        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw new AppError(500, error.message);
        } else {
            throw new AppError(500, 'Unexpected error occurred');
        }
    }
}