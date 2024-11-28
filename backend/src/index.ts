
import { earthquakeData } from "./natural_hazards/getEarthquakes";
import prisma from "./prisma/prismaClient";
import { NaturalHazardService } from "./services/NaturalHazardService";

async function main() {
  const test = await NaturalHazardService("Spain", 1);
  const params = {
    startTime: "2015-01-01",
    endTime: "2020-11-28",
    latitude: "43.46587",
    longitude: "43.46587",
    format: "geojson",
    maxRadius: 3,
  };
  // const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";
  // const eqData = await earthquakeData(earthquakeApiUrl).getEarthquakeData(params);
  console.log(JSON.stringify(test, null, 2));
  //   const data = getGeoCoordinates("Spain");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
