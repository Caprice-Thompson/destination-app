import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { VolcanoService } from "../services/VolcanoService";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const volcanoService = new VolcanoService();
    const volcanoesByCountry = await volcanoService.getVolcanoByCountry(
      "Spain"
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Scheduled task executed successfully!",
        data: volcanoesByCountry,
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "some error",
      }),
    };
  }
};
