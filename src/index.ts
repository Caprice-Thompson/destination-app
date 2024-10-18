import { LargestCity, PrismaClient } from "@prisma/client";
import {
  URLSForLargestCities,
  URLSForThingsToDo,
  URLSForWorldHeritageSites,
} from "./web/utils/constants";
import { scrapeDataWithRateLimits } from "./web/utils/scrapeData";
import { getVolcanoList } from "./climate/volcanoes";
import { getWorldHeritageSites } from "./web/unescoSites";
const prisma = new PrismaClient();
async function main() {
  const test = await scrapeDataWithRateLimits(
    URLSForWorldHeritageSites,
    getWorldHeritageSites
  );
  console.log(test);
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
