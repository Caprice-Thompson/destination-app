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
