import { fetchCountryData } from "../src/climate_features/country";


describe("Country Data", () => {

    it("When I enter country name, I get country data", async () => {
        const countryData = await fetchCountryData('Spain');
        expect(countryData).toBeDefined();
    });
});