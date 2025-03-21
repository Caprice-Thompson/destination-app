import { CountryRepo } from "./services/CountryService";
import { EarthquakeDomain, EarthquakeService } from "./services/EarthquakeService";
import { getEQParams } from "./utils/helper";

async function main() {
  const earthquakeService = new EarthquakeService(
    process.env.EQ_BASE_URL ?? "",
    getEQParams({ latt: "35.681236", longt: "139.767125" })
  );

  const earthquakeDomain = new EarthquakeDomain(earthquakeService);
  const result = await earthquakeDomain.getEarthquakeData("Japan", 10);
  console.log(result);
}

main();
