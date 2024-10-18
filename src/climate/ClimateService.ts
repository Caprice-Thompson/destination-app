// Input: Dependencies and location
// Output: Weather, Earthquakes, Volcanoes,
// const climateService = await climateServices.getData();

import { averageEarthquakeData, getEarthquakeData } from "./getEarthquakes";
import { getGeoCoordinates } from "./getGeoCoordinates";
import { getVolcanoList } from "./volcanoes";

export const token = process.env.AUTH_TOKEN || "";

async function ClimateService(location: string, targetMonth: number) {
  const coordinates = await getGeoCoordinates(location, token);

  const startDate = "";
  const endDate = new Date().toString();
  const latitude = coordinates.latitude;
  const longitude = coordinates.longitude;

  const params = { startDate, endDate, latitude, longitude };

  const eqData = await getEarthquakeData(params);
  const earthquakeAvgData = averageEarthquakeData(eqData, targetMonth);
  const volcanoList = getVolcanoList();
}

export { ClimateService };
