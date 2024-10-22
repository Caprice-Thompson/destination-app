import prisma from "../prisma/prismaClient";
import { NaturalHazardService } from "./natural_hazards/NaturalHazardService";
import { getGeoCoordinates } from "./natural_hazards/getGeoCoordinates";

async function main() {
  const test = await NaturalHazardService("Spain", 1);
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
