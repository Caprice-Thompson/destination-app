import { NaturalHazard, Service } from "../types";
import {
  averageEarthquakeData,
  earthquakeData,
} from "../natural_hazards/getEarthquakes";
import { getGeoCoordinates } from "../natural_hazards/getGeoCoordinates";
import { getVolcanoByCountry } from "../natural_hazards/volcanoes";

async function NaturalHazardService(
  location: string,
  targetMonth: number
): Promise<Service<NaturalHazard>> {
  const coordinates = await getGeoCoordinates(location);
  const today = new Date();
  const formattedDate = today.toISOString().split("T")[0];
  const pastDate = "2015-01-01";
  const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";
  const params = {
    startTime: pastDate,
    endTime: formattedDate,
    latitude: coordinates!.latt,
    longitude: coordinates!.longt,
    format: "geojson",
    maxRadius: 3,
  };

  const eqData = await earthquakeData(earthquakeApiUrl).getEarthquakeData(params);

  const earthquakeAvgData = averageEarthquakeData(eqData, targetMonth);
  const volcanoList = getVolcanoByCountry(location);

  return {
    data: {
      volcano: await volcanoList,
      earthquake: eqData,
      earthquakeAverages: earthquakeAvgData,
    },
  };
}

export { NaturalHazardService };
