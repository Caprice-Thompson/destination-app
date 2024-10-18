import axios from "axios";
import * as cheerio from "cheerio";
import prisma from "../../prisma/prismaClient";

export async function scrapeDataForPopulation(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const cities: any[] = [];

    $("table.wikitable tbody tr").each((index: any, element: any) => {
      if (index === 0) return;

      const tds = $(element).find("td");
      const ths = $(element).find("th");
      if (tds.length >= 2) {
        const city = $(ths[0]).text().trim();
        const country = $(tds[0]).text().trim();
        const population = $(tds[3]).text().trim();

        cities.push({
          city: city,
          country: country,
          population: population,
        });
      }
    });

    const populationData = cities.map((result) =>
      prisma.largestCity.create({
        data: {
          city: result.city,
          country: result.country,
          population: result.population,
        },
      })
    );

    await Promise.all(populationData);
    console.log(`Successfully written data for ${url} to file`);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}
