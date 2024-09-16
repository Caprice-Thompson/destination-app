import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";


const urls = [
  "https://en.wikipedia.org/wiki/List_of_largest_cities",
];

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeData(url: string) {
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
          population: population
        });
      }
    });

    fs.writeFileSync(`cities_${url.split("/").pop()}.json`, JSON.stringify(cities, null, 2));
    console.log(`Successfully written data for ${url} to file`);
  }
  catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}

// Function to scrape all URLs with rate limiting
export async function scrapeDataWithRateLimit() {
  for (let i = 0; i < urls.length; i++) {
    await scrapeData(urls[i]);
    await delay(2000); // 2 seconds between each request
  }
}

// Invoke the function
