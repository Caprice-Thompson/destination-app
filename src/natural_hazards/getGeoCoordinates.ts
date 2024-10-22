import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";

export const getGeoCoordinates = async (
  location: string
): Promise<Coordinates> => {
  const GEO_ENDPOINT = process.env.GEO_ENDPOINT;
  const GEO_TOKEN = process.env.GEO_TOKEN;

  const url = `${GEO_ENDPOINT}${location}?json=1&auth=${GEO_TOKEN}`;
  const response = await apiClient<any>(url);

  const coordinates: Coordinates = {
    latitude: response.latt,
    longitude: response.longt,
  };

  return coordinates;
};

// use as composition function in earthquake data -> get rid of unit tests?