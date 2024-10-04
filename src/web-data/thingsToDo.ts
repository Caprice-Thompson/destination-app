import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";

const urls = [
  "https://orionrose.weebly.com/bucket-list.html",
];
interface CountryDescription {
  country: string;
  descriptions: string[];
}
const delay = (ms: any) => new Promise(resolve => setTimeout(resolve, ms));
// TODO: put in a db, Run a cron job
// Function to scrape data from a single URL
async function scrapeData(url: string) {
  try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

      const results: CountryDescription[] = [];

      // Iterate through each <span> containing the country
      $('div.paragraph span > span > font').each((index, element) => {
        // Check for a hyperlink and get the country text
        const anchor = $(element).find('a');
        const anchorText = anchor.length > 0 ? anchor.text().trim() : '';
        const remainingText = $(element).contents().not(anchor).text().trim();
    
        // Debugging output for anchor and remaining text
        console.log(`Anchor Text: ${anchorText}, Remaining Text: ${remainingText}`);
    
        // Navigate to find extraCountry
        const extraCountry = $(element).parent().parent().find('font > span').eq(1).text().trim();
        console.log(`Extra Country: ${extraCountry}`); // Debugging line
    
        // Combine both parts to form the full country text
        const countryText = `${anchorText} ${remainingText}`.trim();
        
        // Use regex matches for both cases
        const matchCountryText = countryText.match(/(.*?)\s*\((\d+)\)$/);
        const matchExtraCountry = extraCountry.match(/(.*?)\s*\((\d+)\)$/);
    
        // Debugging output for matches
        console.log(`Country Text: ${countryText}, Match Country: ${matchCountryText}, Match Extra: ${matchExtraCountry}`);
    
        // Determine which country to use based on matches
        const country = (matchCountryText ? matchCountryText[1].trim() : (matchExtraCountry ? matchExtraCountry[1].trim() : null));
        
        // Debugging output to see which country is being processed
        console.log(`Processing country: ${country}`);
    
        // Proceed only if a valid country entry was found
        if (country) {
            const descriptions: string[] = [];
            const nextUl = $(element).closest('span').parent().next('ul');
    
            if (nextUl.length > 0) {
                nextUl.find('li').each((i, liElement) => {
                    // Get description from various span structures
                    const description = $(liElement).find('span > font > span').text() ||
                                        $(liElement).find('span > span > font').text() ||
                                        $(liElement).find('font > span').text() ||
                                        $(liElement).find('span > font > span').eq(1).text().trim() || // Check for additional spans
                                        $(liElement).find('span > font > span').eq(0).text().trim();
    
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
            const countryExists = results.some(item => item.country === country);
            if (!countryExists) {
                console.log(`Adding country: ${country}`); // Debugging line
                results.push({ country, descriptions });
            } else {
                console.log(`Country already exists: ${country}`); // Debugging line
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