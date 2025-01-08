import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { VolcanoService } from "../services/VolcanoService";
import { AppError } from "../utils/errorHandler";

export const getVolcanoServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const volcanoService = new VolcanoService();

    const country = event.queryStringParameters?.country;
    if (!country) {
      throw new AppError(400, 'Country parameter is required');
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
    throw new AppError(500, 'Internal server error');
  }
};
