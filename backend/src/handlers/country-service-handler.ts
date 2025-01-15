import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { CountryService } from "../services/CountryService";
import { AppError } from "../utils/errorHandler";

export const getCountryServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    const country = event.queryStringParameters?.country;
    if (!country) {
      throw new AppError(400, "Country parameter is required");
    }

    const countryService = new CountryService(country);
    const cityPopulation = await countryService.getCityPopulation();
    const countryDetails = await countryService.getCountryDetails();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Country service executed successfully!",
        data: {
          cityPopulation,
          countryDetails
        }
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