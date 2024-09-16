import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import { SiteData } from "../types";

const urls: string[] = [
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
    "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Western_Asia"
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


async function scrapeData(url: string): Promise<SiteData[]> {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const sites: SiteData[] = [];

        $("table.wikitable tbody tr").each((index, element) => {
            if (index === 0) return; 

            const tds = $(element).find("td");
            const ths = $(element).find("th");

            if (tds.length >= 2 && ths.length > 0) {
                const site = $(ths[0]).text().trim();
                const location = $(tds[1]).find("span").eq(0).text().trim();
                const description = $(tds[5]).text().trim(); 

                sites.push({ site, location, description });
            }
        });

        return sites; 
    } catch (error) {
        console.error(`Error scraping ${url}:`, error);
        return []; 
    }
}
export async function scrapeAllData(): Promise<void> {
    const allSites: SiteData[] = [];

    for (let i = 0; i < urls.length; i++) {
        console.log(`Scraping data from: ${urls[i]}`);
        const siteData = await scrapeData(urls[i]);
        allSites.push(...siteData); 

        await delay(3000); 
    }

    fs.writeFileSync('world_heritage_sites.json', JSON.stringify(allSites, null, 2));
    console.log('All data successfully written to world_heritage_sites.json');
}
