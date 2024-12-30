import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { TourismService } from "../services/TourismService";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    if (!country) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Country parameter is required.",
        }),
      };
    }

    const tourismService = new TourismService(country);
    const thingsToDo = tourismService.thingsToDoList();
    const unescoSites = tourismService.getUNESCOSitesList();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scheduled task executed successfully!",
        data: [JSON.stringify(thingsToDo), JSON.stringify(unescoSites)],
      }),
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
