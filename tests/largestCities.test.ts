import { fetchCountryData } from "../src/climate_features/country";
import { scrapeDataWithRateLimit } from "../src/web-data/largestCities";


describe("Country Data", () => {

    it("When I enter country name, I get country data", async () => {
        const countryData = await scrapeDataWithRateLimit();
        console.log(countryData);

    });
});