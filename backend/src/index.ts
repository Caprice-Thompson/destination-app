import prisma from "./prisma/prismaClient";
import { NaturalHazardService } from "./services/NaturalHazardService";
import { getVolcanoList } from "./natural_hazards/volcanoes";
import { getURL } from "./api/getURL";

async function main() {
  //const test = await NaturalHazardService("Spain", 1);
  //const test2 = await getVolcanoList();
  const as = getURL({
    baseURL: "https://www.google.co.uk",
    path: "",
    params: [""],
  });
  console.log(as);
  //console.log(JSON.stringify(test, null, 2));
  // console.log(JSON.stringify(test2, null, 2));
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
