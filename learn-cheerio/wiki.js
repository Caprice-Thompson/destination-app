const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const urls = [
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Africa", 
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_the_Caribbean",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Central_America",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Eastern_Europe",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Northern_Europe",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Southern_Europe",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Western_Europe",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Eastern_Asia",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Oceania",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_North_America",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_South_America",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Northern_and_Central_Asia",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Southeast_Asia",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Southern_Asia",
  "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Western_Asia",

  // Add more URLs if pagination is required
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const cities = [];

    $("table.wikitable tbody tr").each((index, element) => {
      if (index === 0) return;

      const tds = $(element).find("td");
      const tds1 = $(element).find("td");
      const ths = $(element).find("th");
      if (tds.length >= 2) {
        const site = $(ths[0]).text().trim();
        const location = $(tds[1]).find("span").eq(0).text().trim();
        const description = $(tds1[5]).text().trim();
        console.log(site, location, description);
        cities.push({
          site: site,
          location: location,
          description: description,

        });
      }
    });

    fs.writeFileSync(`cities_${url.split("/").pop()}.json`, JSON.stringify(cities, null, 2), (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Successfully written data for ${url} to file`);
        }
      });
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
    }
  }
  
  // Function to scrape all URLs with rate limiting
  async function scrapeDataWithRateLimit() {
    for (let i = 0; i < urls.length; i++) {
      await scrapeData(urls[i]);
      await delay(2000); // 2 seconds between each request
    }
  }
  
  // Invoke the function
  scrapeDataWithRateLimit();