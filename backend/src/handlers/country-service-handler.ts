import { APIGatewayEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { CountryDomain, CountryRepo } from "../services/CountryService";
import { AppError } from "../utils/errorHandler";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://d1c44nd79uod1i.cloudfront.net/",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  "Access-Control-Allow-Credentials": "true",
};

export const getCountryServiceHandler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
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
      headers: corsHeaders,
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
      headers: corsHeaders,
      body: JSON.stringify({ message }),
    };
  }
};
