import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";


export interface GeoApiResponse {
  latt: string;
  longt: string;
}

export const getGeoCoordinates = async (location: string, token: string) => {
  const url = `https://geocode.xyz/${location}?json=1&auth=${token}`;
  const coordinates = await apiClient<Coordinates>(url);
  console.log(coordinates);
};
