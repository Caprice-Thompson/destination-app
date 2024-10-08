import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";

export const getGeoCoordinates = async (
  location: string,
  token: string
): Promise<Coordinates> => {
  const url = `https://geocode.xyz/${location}?json=1&auth=${token}`;
  const response = await apiClient<any>(url);

  const coordinates: Coordinates = {
    latitude: response.data.latt,
    longitude: response.data.longt,
  };

  return coordinates;
};
