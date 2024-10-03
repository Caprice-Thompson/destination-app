import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const urls = [
  "https://orionrose.weebly.com/bucket-list.html",
];

const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));
// TODO: put in a db, Run a cron job
// Function to scrape data from a single URL
async function scrapeData(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const allCountries: { name: string; itemCount: number }[] = [];
    const allItems: string[] = [];
    const mergedData: { country: string; listItems: string[] }[] = [];

    const results: CountryDescription[] = [];
    interface CountryDescription {
      country: string;
      descriptions: string[];
  }
// Iterate through each <span> containing the country
$('div.paragraph span > span > font').each((index, element) => {
  // Check for a hyperlink and get the country text
  const anchor = $(element).find('a');
  const anchorText = anchor.length > 0 ? anchor.text().trim() : '';
  
  // Get the remaining text and concatenate
  const remainingText = $(element).contents().not(anchor).text().trim();
  
  // Combine both parts to form the full country text
  const countryText = `${anchorText} ${remainingText}`.trim();

  const match = countryText.match(/(.*) \((\d+)\)$/); // Matches "Country (X)"

  // Proceed only if it's a valid country entry
  if (match) {
      const country = match[1].trim();
      const descriptions: string[] = [];

      // Move out to find the next <ul> element
      const nextUl = $(element).closest('span').parent().next('ul');

      // Ensure the next element is an <ul> before proceeding
      if (nextUl.length > 0) {
          nextUl.find('li').each((i, liElement) => {
              // Try to get the description from span > font
              let description = $(liElement).find('span > font > span').text();
              if (!description) {
                  description = $(liElement).find('span > span > font').text();
              }

              if (description) {
                  const trimmedDescription = description.trim();
                  // Check for duplicates before pushing
                  if (!descriptions.includes(trimmedDescription)) {
                      descriptions.push(trimmedDescription);
                  }
              }
          });
      }

      // Only add to results if the country isn't already included
      if (!results.some(item => item.country === country)) {
          results.push({ country, descriptions });
      }

  } else {
      // Handle cases where the current text is a description (not a country)
      const lastResult = results[results.length - 1];
      if (lastResult) {
          let description = $(element).closest('li').find('span > font > span').text();
          if (!description) {
              description = $(element).closest('li').find('span > span > font').text();
          }

          if (description) {
              const trimmedDescription = description.trim();
              // Check for duplicates before pushing
              if (!lastResult.descriptions.includes(trimmedDescription)) {
                  lastResult.descriptions.push(trimmedDescription);
              }
          }
      }
  }
});

    fs.writeFileSync(`merged_${url.split("/").pop()}.json`, JSON.stringify(results, null, 2));

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