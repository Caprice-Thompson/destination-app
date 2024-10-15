import axios from "axios";
import * as cheerio from "cheerio";
import { WorldHeritageSiteData } from "../../types";
import prisma from "../../../prisma/prismaClient";

export async function getWorldHeritageSites(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const sites: WorldHeritageSiteData[] = [];

    $("table.wikitable tbody tr").each((index, element) => {
      if (index === 0) return;

      const tds = $(element).find("td");
      const ths = $(element).find("th");

      if (tds.length >= 2 && ths.length > 0) {
        const site = $(ths[0]).text().trim();
        //const location = $(tds[1]).find("a").eq(1).text().trim();
        const location = $(tds[1]).find("span").eq(0).text().trim();
        const description = $(tds[5]).text().trim();

        const normalisedDescription = description
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();

        sites.push({ site, location, description: normalisedDescription });
      }
    });

    // Insert data into the database
    const createPromises = sites.map((site) =>
      prisma.worldHeritageSite.create({
        data: {
          site: site.site,
          location: site.location,
          description: site.description,
        },
      })
    );

    await Promise.all(createPromises);
    console.log("All World Heritage Sites successfully written to the database.");
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}
