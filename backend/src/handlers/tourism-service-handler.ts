import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

import { AppError } from "../utils/errorHandler";
import {
  TourismApplicationService,
  TourismDatabaseRepository,
} from "../services/TourismService";

const tourismDatabaseRepo = new TourismDatabaseRepository();
const tourismAppService = new TourismApplicationService(tourismDatabaseRepo);

export const getTourismServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    if (!country) {
      throw new AppError(400, "Country parameter is required");
    }

    const tourismData = await tourismAppService.getTourismData(country);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Tourism service executed successfully!",
          data: tourismData,
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
