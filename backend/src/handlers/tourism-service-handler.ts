import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";

import { AppError } from "../utils/errorHandler";
import {
  TourismApplicationService,
  TourismDatabaseRepository,
} from "../services/TourismService";

const tourismDatabaseRepo = new TourismDatabaseRepository();
const tourismAppLayer = new TourismApplicationService(tourismDatabaseRepo);

export const getTourismServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {

    const country = event.queryStringParameters?.country;
    const tourismData = await tourismAppLayer.getTourismData(country);

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
