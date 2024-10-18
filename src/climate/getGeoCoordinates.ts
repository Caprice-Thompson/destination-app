import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";

const GEO_ENDPOINT = process.env;

export const getGeoCoordinates = async (
  location: string,
  token: string
): Promise<Coordinates> => {
  const url = `${GEO_ENDPOINT}/${location}?json=1&auth=${token}`;
  const response = await apiClient<any>(url);

  const coordinates: Coordinates = {
    latitude: response.data.latt,
    longitude: response.data.longt,
  };

  return coordinates;
};
