import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";


const urls = [
    "https://orionrose.weebly.com/bucket-list.html",
];

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeData(url: string) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const cities: any[] = [];

        let countries: any;
        let currentCountry = '';

        $("ul li").each((index, element) => {
            const listItem = $(element).text().trim();
            const tds = $(element).find("span");



            const country = $(tds[0]).text().trim();
            // $("ul li")[10]; - alaska
            // Check if the listItem starts with a country (we'll assume it contains a number in parentheses)
            const countryMatch = listItem.match(/^(.*)\s\(\d+\)$/);
            console.log(countryMatch);
            if (countryMatch) {
                // New country found
                currentCountry = countryMatch[1].trim(); // Get the country name
                countries.push({
                    country: currentCountry,
                    list_items: []
                });
            } else if (currentCountry) {
                // Add to the last country found in the array
                countries[countries.length - 1].list_items.push({
                    description: listItem
                });
            }
        });

        console.log(countries);


        fs.writeFileSync(`cities_${url.split("/").pop()}.json`, JSON.stringify(cities, null, 2));
        console.log(`Successfully written data for ${url} to file`);
    }
    catch (error) {
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

// Invoke the function
