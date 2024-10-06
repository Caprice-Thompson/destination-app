import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { WorldHeritageSiteData } from "../../types";

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

    fs.writeFileSync(
      "world_heritage_sites.json",
      JSON.stringify(sites, null, 2)
    );
    console.log("All data successfully written to world_heritage_sites.json");
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}
