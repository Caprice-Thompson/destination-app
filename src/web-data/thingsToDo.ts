import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { getCountryText, getDescription, validateLocation } from "./helper";
import { ThingsToDo } from "../types";

const urls = [
  "https://orionrose.weebly.com/bucket-list.html",
];

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));
// TODO: put in a db, Run a cron job

async function scrapeData(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const results: ThingsToDo[] = [];

    $('div.paragraph span > span > font').each((_, element) => {
      const anchor = $(element).find('a');
      const anchorText = anchor.text().trim();
      const remainingText = $(element).contents().not('a').text().trim();

      const countryText = `${anchorText} ${remainingText}`.trim();
      const location = validateLocation(countryText);
      if (location) {
        const items: string[] = [];
        const nextUl = $(element).closest('span').parent().next('ul');

        if (nextUl.length) {
          getDescription(nextUl, items, $);
        }

        if (!results.some(item => item.location === location)) {
          results.push({ location, item: items });
        } else {
          console.log(`Country already exists: ${location}`);
        }
      }
    });

    $('div.paragraph span > font > span').each((_, element) => {
      const fullCountryText = getCountryText($(element), $);
      const validatedCountry = fullCountryText ? validateLocation(fullCountryText) : null;

      if (validatedCountry) {
        const items: string[] = [];
        const nextUl = $(element).closest('font').parent().next('ul');
        getDescription(nextUl, items, $);

        if (!results.some(item => item.location === validatedCountry)) {
          results.push({ location: validatedCountry, item: items });
        }
      }
    });

    fs.writeFileSync(`things-to-do.json`, JSON.stringify(results, null, 2));

    console.log(`Successfully merged data for ${url} and written to file`);

  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
  }
}

// Function to scrape all URLs with rate limiting
export async function scrapeDataWithRateLimits() {
  for (let i = 0; i < urls.length; i++) {
    await scrapeData(urls[i]);
    await delay(2000); // 2 seconds between each request
  }
}