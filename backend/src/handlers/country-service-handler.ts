import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { CountryDomain, CountryRepo } from "../services/CountryService";
import { AppError } from "../utils/errorHandler";

export const getCountryServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
        'Access-Control-Max-Age': '3600',
      },
      body: '',
    };
  }

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
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
      },
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
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message =
      error instanceof AppError ? error.message : "Internal server error";

    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    };
  }
};
