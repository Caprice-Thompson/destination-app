import {
  EarthquakeDataParams,
} from "../services/EarthquakeService";
import { Coordinates } from "./getGeoCoordinates";

export const getEQParams = (coordinates: Coordinates): EarthquakeDataParams => {
  const currentDate = new Date();
  const eqHistoryYears = 20;
  const formattedDate = currentDate.toISOString().split("T")[0];
  currentDate.setFullYear(currentDate.getFullYear() - eqHistoryYears);
  const formattedStartDate = currentDate.toISOString().split("T")[0];
  const params = {
    longitude: coordinates?.longt,
    latitude: coordinates?.latt,
    startTime: formattedStartDate,
    endTime: formattedDate,
    maxRadius: 3,
    limit: 1000,
    format: "geojson",
  };
  return params;
};

export const simulateAPIGatewayEvent = (path: string, queryStringParameters: { [key: string]: string }, headers: { [key: string]: string }) => {
  return {
    httpMethod: "GET",
    path: path,
    queryStringParameters,
    headers,
    body: null,
    isBase64Encoded: false,
    pathParameters: null,
    stageVariables: null,
    resource: "",
    requestContext: {} as any,
    multiValueHeaders: {},
    multiValueQueryStringParameters: null,
  }
};
