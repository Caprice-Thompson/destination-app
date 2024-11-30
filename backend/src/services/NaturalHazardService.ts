import { NaturalHazard, Service } from "../types";
import {
  averageEarthquakeData,
  earthquakeService,
} from "../natural_hazards/getEarthquakes";
import { getGeoCoordinates } from "../natural_hazards/getGeoCoordinates";
import { getVolcanoByCountry } from "../natural_hazards/volcanoes";

// currently its just a function that returns a list
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
  // i have to get eq data from the earthquake service
  const eqData = await earthquakeService(earthquakeApiUrl).getEarthquakeData(
    params
  );
// then use it again here - should be all in one?
  const earthquakeAvgData = averageEarthquakeData(eqData, targetMonth);
  const volcanoList = getVolcanoByCountry(location);
// I should just have display earthquake info none of the set up - shouldnt do set up in service
  return {
    data: {
      volcano: await volcanoList,
      earthquake: eqData,
      earthquakeAverages: earthquakeAvgData,
    },
  };
}

export { NaturalHazardService };
