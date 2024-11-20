// Input: Dependencies and location
// Climate: Weather, rainfall
// NaturalHazardService: Earthquakes, Volcanoes, Tsunami, hurricane etc
// const NaturalHazardService = await NaturalHazardService.getData();
// Output:return json of data
import { NaturalHazard, Service } from "../types";
import { averageEarthquakeData, getEarthquakeData } from "./getEarthquakes";
import { getGeoCoordinates } from "./getGeoCoordinates";
import { getVolcanoByCountry } from "./volcanoes";

export const token = process.env.GEO_TOKEN;

async function NaturalHazardService(
  location: string,
  targetMonth: number
): Promise<Service<NaturalHazard>> {
  const coordinates = await getGeoCoordinates(location);
  const startDate = "2002-01-01";
  const endDate = "2022-12-01";
  const latitude = coordinates.latitude;
  const longitude = coordinates.longitude;

  const params = { startDate, endDate, latitude, longitude };

  const eqData = await getEarthquakeData(params);

  const earthquakeAvgData = averageEarthquakeData(eqData, targetMonth);
  const volcanoList = getVolcanoByCountry(location);
  console.log(earthquakeAvgData);

  return {
    data: {
      volcano: await volcanoList,
      earthquake: eqData,
      earthquakeAverages: earthquakeAvgData,
    },
  };
}

export { NaturalHazardService };
