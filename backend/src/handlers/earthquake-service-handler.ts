import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { getGeoCoordinates } from "../utils/getGeoCoordinates";
import { getEQParams } from "../utils/helper";
import { launchEarthquakeService } from "../services/EarthquakeService";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    const monthString = event.queryStringParameters?.month;
    if (!country || !monthString) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Country and month parameters are required.",
        }),
      };
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
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error.",
      }),
    };
  }
};
