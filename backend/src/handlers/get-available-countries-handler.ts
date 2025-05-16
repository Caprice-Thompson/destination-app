import { APIGatewayEvent } from "aws-lambda";
import { Context } from "aws-lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import { AppError } from "../utils/errorHandler";
import { TourismDatabaseRepository, TourismApplicationService } from "../services/TourismService";

const tourismDatabaseRepo = new TourismDatabaseRepository();
const tourismAppLayer = new TourismApplicationService(tourismDatabaseRepo);
// do i need a lambda for this? can i use something else?
export const getAvailableCountriesHandler = async (
    event: APIGatewayEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    console.log('[getAvailableCountriesHandler] Starting execution');

    try {
        console.log('[getAvailableCountriesHandler] Fetching available countries');
        const countries = await tourismAppLayer.getAvailableCountries();

        console.log('[getAvailableCountriesHandler] Successfully retrieved countries', {
            count: countries.length,
            requestId: context.awsRequestId
        });

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: "Available countries retrieved successfully!",
                    data: countries,
                },
                null,
                2
            ),
        };
    } catch (error) {
        if (error instanceof AppError) {
            console.error('[getAvailableCountriesHandler] Application error occurred', {
                error: {
                    message: error.message,
                    statusCode: error.statusCode,
                    detail: error.detail
                },
                requestId: context.awsRequestId
            });

            return {
                statusCode: error.statusCode,
                body: JSON.stringify({
                    message: error.message,
                    detail: error.detail,
                }),
            };
        }

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal server error",
            }),
        };
    }
};