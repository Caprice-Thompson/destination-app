const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

// URL of the page we want to scrape
const urls = [
  "https://worldpopulationreview.com/cities", 
  // Add more URLs if needed
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const cities = [];

    $("table.tp-table-body tbody tr").each((index, element) => {
      if (index === 0) return;

      const tds = $(element).find("td");
      const ths = $(element).find("th");
      if (tds.length >= 2) {
        //const city = $(ths[0]).text().trim().replace(/\d+/g, '');
        //console.log(city);
        const city = $(tds[0]).children("a").text();
        console.log(city);

        const country = $(tds[1]).children("a").text();
        console.log(country);
        const population = $(tds[3]).text().trim();

        cities.push({
          city: city,
          country: country,
          population: population
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