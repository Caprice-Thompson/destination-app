import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { getGeoCoordinates } from "../utils/getGeoCoordinates";
import { getEQParams } from "../utils/helper";
import { AppError } from "../utils/errorHandler";
import { EarthquakeDomain, EarthquakeService } from "../services/EarthquakeService";

export const getEarthquakeServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    const monthString = event.queryStringParameters?.month;
    if (!country || !monthString) {
      throw new AppError(400, 'Country and month parameters are required.');
    }

    const month = parseInt(monthString, 10);
    const coordinates = await getGeoCoordinates(country);
    const params = getEQParams(coordinates!);

    const earthquakeRepo = new EarthquakeService(
      process.env.EQ_BASE_URL ?? "",
      params
    );

    const earthquakeDomain = new EarthquakeDomain(earthquakeRepo);
    const result = await earthquakeDomain.getEarthquakeData(country, month);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Earthquake service executed successfully!",
          data: result
        }, null, 2),
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          detail: error.detail
        })
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error"
      })
    };
  }
};
