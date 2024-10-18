import prisma from "./prismaClient";

export const getThingsToDo = async (country: string) => {
  await prisma.thingToDo.findMany({
    where: {
      location: country,
    },
  });
};

export const getPopulation = async (country: string) => {
  await prisma.largestCity.findMany({
    where: {
      country: country,
    },
  });
};

export const getWorldHeritageSites = async (country: string) => {
  await prisma.worldHeritageSite.findMany({
    where: {
      location: country,
    },
  });
};
