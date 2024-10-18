import axios from "axios";
import * as cheerio from "cheerio";
import { WorldHeritageSiteData } from "../types";
import prisma from "../../prisma/prismaClient";

// 7 wonders of the world
export async function getWorldHeritageSites(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const sites: WorldHeritageSiteData[] = [];
    // regex do not include numbers
    $("table.wikitable tbody tr").each((index, element) => {
      if (index === 0) return;

      const tableData = $(element).find("td");
      const tableHeader = $(element).find("th");

      if (tableData.length >= 2 && tableHeader.length > 0) {
        const site = $(tableHeader[0]).text().trim();
        const area = $(tableData[1]).find("a").eq(0).text().trim();
        const country = $(tableData[1]).children("a").last().text().trim();
        const description = $(tableData[5]).text().trim();
        const siteMatch = !site.match(/\d/);
        const descMatch = !description.match(/\[\d+\]\[\d+\]|\[\d+\]/);

        const normalisedDescription = description
          .replace(/\n/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        console.log(country);
        sites.push({
          site: siteMatch ? site : "",
          area: area,
          country: country,
          description: descMatch ? normalisedDescription : "",
        });
      }
    });

    const unesco = sites.map((site) =>
      prisma.worldHeritageSite.create({
        data: {
          site: site.site,
          area: site.area,
          country: site.country,
          description: site.description,
        },
      })
    );

    await Promise.all(unesco);
    console.log(
      `All World Heritage Sites for ${url} successfully written to the database.`
    );
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}
