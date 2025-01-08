import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { VolcanoService } from "../services/VolcanoService";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const volcanoService = new VolcanoService();

    const country = event.queryStringParameters?.country;
    if (!country) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Country parameter is required.",
        }),
      };
    }

    const volcanoesByCountry = await volcanoService.getVolcanoByCountry(
      country
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Volcano service executed successfully!",
        data: volcanoesByCountry,
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
