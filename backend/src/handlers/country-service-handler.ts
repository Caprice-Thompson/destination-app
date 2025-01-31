import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { CountryDomain, CountryRepo } from "../services/CountryService";
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
    const countryRepo = new CountryRepo(country);
    const countryDomain = new CountryDomain(countryRepo);

    const countryData = await countryDomain.getCountryData(country);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Country service executed successfully!",
          data: countryData,
        },
        null,
        2
      ),
    };
  } catch (error) {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          detail: error.detail,
        }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal server error",
      }),
    };
  }
};
