import { getCountryDetails } from "./country/country";
import { earthquakeData } from "./natural_hazards/getEarthquakes";
import { getPopulation, getWorldHeritageSites } from "./prisma/dbQueries";
import { getThingsToDo } from "./prisma/dbQueries";
import prisma from "./prisma/prismaClient";
import { CountryService } from "./services/CountryService";
import { NaturalHazardService } from "./services/NaturalHazardService";
import {
  Country,
  Population,
  ThingsToDo,
  WorldHeritageSiteData,
} from "./types";

async function main() {
  const test = await NaturalHazardService("Spain", 1);

  const serviceResult = await CountryService({
    getCountryDetails: getCountryDetails as (
      location: string
    ) => Promise<Country>,
    getThingsToDo: getThingsToDo as (location: string) => Promise<ThingsToDo[]>,
    getPopulation: getPopulation as (country: string) => Promise<Population[]>,
    getWorldHeritageSites: getWorldHeritageSites as (
      country: string
    ) => Promise<WorldHeritageSiteData[]>,
  }).getCountryService("Spain");

  console.log(JSON.stringify(serviceResult, null, 2));
  console.log(JSON.stringify(test, null, 2));
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
