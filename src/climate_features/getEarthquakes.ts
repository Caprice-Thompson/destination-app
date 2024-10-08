import { apiClient } from "../api/apiClient";
import { Earthquake } from "../types";

export interface EarthquakeDataParams {
  longitude: string;
  latitude: string;
  startDate: string;
  endDate: string;
  limit?: number;
}

export const getEarthquakeData = async (
  params: EarthquakeDataParams
): Promise<Earthquake[]> => {
  const { startDate, endDate, latitude, longitude, limit = 9000 } = params;
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

  const eqData = await apiClient<any>(url);
  const earthquakeData: Earthquake[] = eqData.features.map((feature: any) => ({
    name: feature.properties.place,
    magnitude: feature.properties.mag.toString(),
    date: new Date(feature.properties.time).toISOString(),
    type: feature.properties.type,
    tsunami: feature.properties.tsunami,
  }));

  return earthquakeData;
};
