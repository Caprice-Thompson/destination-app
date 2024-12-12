import {
  getPopulation,
  getThingsToDo,
  getWorldHeritageSites,
} from "./country/dbQueries";
import { getCountryDetails } from "./country/country";
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
}

main();
