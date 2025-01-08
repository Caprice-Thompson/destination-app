import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { getGeoCoordinates } from "../utils/getGeoCoordinates";
import { getEQParams } from "../utils/helper";
import { launchEarthquakeService } from "../services/EarthquakeService";
import { AppError } from "../utils/errorHandler";

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
    const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";
    const earthquakeService = launchEarthquakeService(earthquakeApiUrl, params);
    const earthquakeData = await earthquakeService.getEarthquakeData();
    const eqAverages = earthquakeService.calculateEarthquakeStatistics(
      earthquakeData,
      month
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Earthquake service executed successfully!",
        data: {
          earthquakeData,
          eqAverages
        }
      }, null, 2),
    };
  } catch (err) {
    console.error("Error occurred:", err);
    throw new AppError(500, 'Internal server error');
  }
};
