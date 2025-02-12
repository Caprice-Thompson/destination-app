import {
  EarthquakeDataParams,
} from "../services/EarthquakeService";
import { Coordinates } from "./getGeoCoordinates";

export const getEQParams = (coordinates: Coordinates): EarthquakeDataParams => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  currentDate.setFullYear(currentDate.getFullYear() - 20);
  const formattedStartDate = currentDate.toISOString().split("T")[0];
  const params = {
    longitude: coordinates?.longt,
    latitude: coordinates?.latt,
    startTime: formattedStartDate,
    endTime: formattedDate,
    maxRadius: 5,
    limit: 20,
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

export const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};