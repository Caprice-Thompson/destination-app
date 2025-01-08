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
      throw new AppError(400, 'Country parameter is required');
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
  } catch (err) {
    console.error("Error occurred:", err);
    throw new AppError(500, 'Internal server error');
  }
};
