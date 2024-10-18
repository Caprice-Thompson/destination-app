import prisma from "../prisma/prismaClient";
import { getVolcanoList } from "./climate/volcanoes";

async function main() {
  const test = await getVolcanoList();
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
