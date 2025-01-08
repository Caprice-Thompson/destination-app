import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { CountryService } from "../services/CountryService";

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
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: `Internal server error. ${err}`,
      }),
    };
  }
};
