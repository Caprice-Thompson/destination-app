import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";

export const getGeoCoordinates = async (
  location: string
): Promise<Coordinates> => {
  const url = `${process.env.GEO_ENDPOINT}${location}?json=1&auth=${process.env.GEO_TOKEN}`;
  const response = await apiClient<any>(url);

  const coordinates: Coordinates = {
    latitude: response.latt,
    longitude: response.longt,
  };
  return coordinates;
};

