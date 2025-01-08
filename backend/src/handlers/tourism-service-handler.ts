import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { TourismService } from "../services/TourismService";
import { AppError } from "../utils/errorHandler";

export const getTourismServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    if (!country) {
      throw new AppError(400, 'Country parameter is required');
    }

    const tourismService = new TourismService(country);
    const thingsToDo = await tourismService.thingsToDoList();
    const unescoSites = await tourismService.getUNESCOSitesList();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Tourism service executed successfully!",
        data: {
          thingsToDo,
          unescoSites
        }
      }, null, 2),
    };
  } catch (err) {
    console.error("Error occurred:", err);
    throw new AppError(500, 'Internal server error');
  }
};
