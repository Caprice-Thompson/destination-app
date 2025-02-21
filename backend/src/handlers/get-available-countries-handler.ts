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
    try {
        const countries = await tourismAppLayer.getAvailableCountries();

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