
import prisma from "../../prisma/prismaClient";
import { CityPopulation } from "./CountryService";
import { ThingsToDo, UNESCOSites } from "./TourismService";

export const getThingsToDo = async (country: string): Promise<ThingsToDo[]> => {
  const thingsToDo = await prisma.thingToDo.findMany({
    where: {
      location: country,
    },
  });
  return thingsToDo;
};

export const getPopulation = async (
  country: string
): Promise<CityPopulation[]> => {
  const population = await prisma.largestCity.findMany({
    where: {
      country: country,
    },
  });
  return population;
};

export const getUNESCOSites = async (
  country: string
): Promise<UNESCOSites[]> => {
  const worldHeritageSites = await prisma.worldHeritageSite.findMany({
    where: {
      country: country,
    },
  });
  return worldHeritageSites;
};
