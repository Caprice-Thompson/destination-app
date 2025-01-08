export class AppError extends Error {
    constructor(public statusCode: number, message: string) {
        super(message);
    }

    errorHandler(error: Error) {
        if (error instanceof AppError) {
            return {
                statusCode: error.statusCode,
                body: JSON.stringify({ message: error.message })
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