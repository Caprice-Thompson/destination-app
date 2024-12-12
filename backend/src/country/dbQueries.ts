import { Population, WorldHeritageSiteData } from "../types";
import { ThingsToDo } from "../types";
import prisma from "../../prisma/prismaClient";

export const getThingsToDo = async (country: string): Promise<ThingsToDo[]> => {
  const thingsToDo = await prisma.thingToDo.findMany({
    where: {
      location: country,
    },
  });
  return thingsToDo;
};

export const getPopulation = async (country: string): Promise<Population[]> => {
  const population = await prisma.largestCity.findMany({
    where: {
      country: country,
    },
  });
  return population;
};

export const getWorldHeritageSites = async (
  country: string
): Promise<WorldHeritageSiteData[]> => {
  const worldHeritageSites = await prisma.worldHeritageSite.findMany({
    where: {
      country: country,
    },
  });
  return worldHeritageSites;
};
