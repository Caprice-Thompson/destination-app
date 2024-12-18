import { NaturalHazard, Service } from "../types";
import {
  averageEarthquakeData,
  earthquakeService,
} from "../natural_hazards/getEarthquakes";
import { getGeoCoordinates } from "../natural_hazards/getGeoCoordinates";
import { getVolcanoByCountry } from "../natural_hazards/volcanoes";
import { getCustomURL } from "../api/getURL";
import { launchEarthquakeService } from "../natural_hazards/EarthquakeService";

// get earthquake service
//get volcano service
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
  const earthquakeURL = getCustomURL.getParams(earthquakeApiUrl, params);
  const earthquakeService = launchEarthquakeService(earthquakeURL, params);
  const earthquakeData = await earthquakeService.getEarthquakeData();

  //Calculate averages for a specific month
  const averages = earthquakeService.calculateEarthquakeStatistics(
    earthquakeData,
    5
  );
  const volcanoList = await getVolcanoByCountry(location);

  return {
    data: {
      volcano: volcanoList,
      earthquake: earthquakeData,
      earthquakeAverages: averages,
    },
  };
}

export { NaturalHazardService };
