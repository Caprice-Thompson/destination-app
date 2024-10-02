import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const urls = [
  "https://orionrose.weebly.com/bucket-list.html",
];

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));

// Function to scrape data from a single URL
async function scrapeData(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const allCountries: { name: string; itemCount: number }[] = [];
    const allItems: string[] = [];
    const mergedData: { country: string; listItems: string[] }[] = [];

    // Get all countries and their item counts
    $("div.paragraph span span font").each((index: any, element: any) => {
      const country = $(element).text().trim();
      console.log(`country: ${country}`);
      const match = country.match(/(.*) \((\d+)\)$/); // Matches "Country (X)"
      if (match) {
        allCountries.push({ name: match[1], itemCount: parseInt(match[2], 10) }); // Add country and item count
      }
    });

    // Get all list items, starting from index 16 (combine spans within each <li>)
    $("ul li").each((index: any, element: any) => {
      if (index >= 25) {
        let item = '';
        // Concatenate all text inside the <li>
        $(element).find("span span").each((i, el) => {
          item = $(el).text().trim();
          // console.log(`trim: ${JSON.stringify(item, null, 2)}`);
          if (item && !allItems.includes(item)) {
            allItems.push(item);
          }
        });

        // Clean up any excessive spaces
        item = item.trim();

      }
    });

    // Merge countries 
    let currentIndex = 0;
    for (const { name, itemCount } of allCountries) {
      const itemsPerCountry = allItems.slice(currentIndex, currentIndex + itemCount);
      mergedData.push({
        country: name,
        listItems: itemsPerCountry
      });
      currentIndex += itemCount;
    }

    fs.writeFileSync(`merged_${url.split("/").pop()}.json`, JSON.stringify(mergedData, null, 2));

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

// Invoke the function
// $("ul li").each((index, element) => {
//     const listItem = $(element).text().trim();
//     const tds = $(element).find("span span font");



//     const country = $(tds[0]).text().trim();
//     // $("ul li")[10]; - alaska
//     // Check if the listItem starts with a country (we'll assume it contains a number in parentheses)
//     const countryMatch = listItem.match(/^(.*)\s\(\d+\)$/);
//     console.log(countryMatch);
//     if (countryMatch) {
//         // New country found
//         currentCountry = countryMatch[1].trim(); // Get the country name
//         countries.push({
//             country: currentCountry,
//             list_items: []
//         });
//     } else if (currentCountry) {
//         // Add to the last country found in the array
//         countries[countries.length - 1].list_items.push({
//             description: listItem
//         });
//     }
// });