import { NaturalHazardService } from "./services/NaturalHazardService";
import { launchEarthquakeService } from "./natural_hazards/EarthquakeService";
import { getCustomURL } from "./api/getURL";
import { VolcanoService } from "./natural_hazards/VolcanoService";

async function main() {
  const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";

  const params = {
    longitude: "-118.2437",
    latitude: "34.0522",
    startTime: "2020-01-01",
    endTime: "2023-12-31",
    maxRadius: 5,
    limit: 10,
    format: "geojson",
  };
  const earthquakeURL = getCustomURL.getParams(earthquakeApiUrl, params);
  console.log(earthquakeURL);
  const earthquakeService = launchEarthquakeService(earthquakeApiUrl, params);
  console.log(earthquakeService);

  // Fetch earthquake data
  const earthquakeData = await earthquakeService.getEarthquakeData();

  //Calculate averages for a specific month
  const averages = earthquakeService.calculateEarthquakeStatistics(
    earthquakeData,
    5
  );
  console.log(averages);

  console.log(JSON.stringify(earthquakeData, null, 2));
  // const service = await NaturalHazardService("Spain", 5);
  // console.log(service);
  const volcanoService = new VolcanoService();

// Get all volcanoes
const allVolcanoes = await volcanoService.getVolcanoList();
console.log(allVolcanoes);

// Get volcanoes by country
const volcanoesInJapan = await volcanoService.getVolcanoByCountry("Japan");
console.log(volcanoesInJapan);

}

main();
