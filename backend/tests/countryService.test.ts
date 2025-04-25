import { getData } from "../src/api/client";
import {
  Country,
  CountryResponse,
  CountryRepo,
  CountryDomain,
} from "../src/services/CountryService";

jest.mock("../src/api/client");
jest.mock("../src/db/db", () => ({
  any: jest.fn()
}));

// Mock database
const mockDb = {
  any: jest.fn()
};

describe("Country Service", () => {
  // describe("getCountryDetails", () => {
  //   const originalEnv = process.env;
  //   const country = "Spain";
  //   const mockUrl = `https://mocked-api.com/${country}`;

  //   const mockCountryResponse: CountryResponse[] = [
  //     {
  //       name: { common: "Spain" },
  //       capital: ["Madrid"],
  //       languages: { name: "Spanish" },
  //       currencies: { EUR: { name: "Euro", symbol: "€" } },
  //       flags: { svg: "https://example.com/es.svg" },
  //     },
  //   ];

  //   const expectedCountryDetails: Country = {
  //     name: "Spain",
  //     capitalCity: ["Madrid"],
  //     languages: [{ name: "Spanish" }],
  //     currencies: { EUR: { name: "Euro", symbol: "€" } },
  //     flag: "https://example.com/es.svg",
  //   };

  //   beforeAll(async () => {
  //     process.env = {
  //       ...originalEnv,
  //       COUNTRY_BASE_URL: "https://mocked-api.com",
  //     };
  //   });

  //   afterAll(() => {
  //     process.env = originalEnv;
  //   });

  //   it("should return country details if the request is successful", async () => {
  //     (getData as jest.Mock).mockResolvedValue(mockCountryResponse);

  //     const countryService = new CountryRepo(country);
  //     const result = await countryService.getCountryDetails();

  //     expect(result).toStrictEqual(expectedCountryDetails);
  //     expect(getData).toHaveBeenCalledWith(mockUrl);
  //   });

  //   it("should throw an error if no data is returned", async () => {
  //     (getData as jest.Mock).mockResolvedValue([]);
  //     const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  //     const countryService = new CountryRepo(country);

  //     await expect(countryService.getCountryDetails()).rejects.toThrow(
  //       "No country data found"
  //     );
  //     await expect(countryService.getCountryDetails()).rejects.toHaveProperty(
  //       "statusCode",
  //       404
  //     );

  //     expect(consoleErrorSpy).toHaveBeenCalledWith(
  //       expect.stringContaining("No data returned from API for URL:")
  //     );
  //   });
  describe("getCityPopulation", () => {
    const populationAPIResponse = {
      total_count: 2,
      results: [
        {
          geoname_id: "1",
          name: "Madrid",
          ascii_name: "Madrid",
          alternate_names: ["Madrid"],
          feature_class: "P",
          feature_code: "PPLA",
          country_code: "ES",
          cou_name_en: "Spain",
          population: 3223334,
          timezone: "Europe/Madrid",
          coordinates: { lon: -3.7038, lat: 40.4168 }
        },
        {
          geoname_id: "2",
          name: "Barcelona",
          ascii_name: "Barcelona",
          alternate_names: ["Barcelona"],
          feature_class: "P",
          feature_code: "PPLA",
          country_code: "ES",
          cou_name_en: "Spain",
          population: 1620343,
          timezone: "Europe/Madrid",
          coordinates: { lon: 2.1734, lat: 41.3851 }
        }
      ]
    };

    const expectedCityPopulations = [
      {
        city: "Madrid",
        country: "Spain",
        population: "3,223,334"
      },
      {
        city: "Barcelona",
        country: "Spain",
        population: "1,620,343"
      }
    ];

    it("should return city populations if the request is successful", async () => {
      (getData as jest.Mock).mockResolvedValue(populationAPIResponse);

      const countryService = new CountryRepo("Spain");
      const result = await countryService.getCityPopulationFromAPI();

      expect(result).toStrictEqual(expectedCityPopulations);
      expect(getData).toHaveBeenCalledWith(
        expect.stringContaining("https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records")
      );
      expect(getData).toHaveBeenCalledWith(
        expect.stringContaining("where=cou_name_en%3D%27Spain%27")
      );
    });

    it("should handle country names with spaces correctly", async () => {
      (getData as jest.Mock).mockResolvedValue(populationAPIResponse);

      const countryService = new CountryRepo("United Kingdom");
      await countryService.getCityPopulationFromAPI();

      expect(getData).toHaveBeenCalledWith(
        expect.stringContaining("where=cou_name_en%3D%27United+Kingdom%27")
      );
    });

    it("should handle country names with special characters correctly", async () => {
      (getData as jest.Mock).mockResolvedValue(populationAPIResponse);

      const countryService = new CountryRepo("Côte d'Ivoire");
      await countryService.getCityPopulationFromAPI();

      expect(getData).toHaveBeenCalledWith(
        expect.stringContaining("where=cou_name_en%3D%27C%C3%B4te+d%5C%27Ivoire%27")
      );
    });

    it("should throw an error if no data is returned", async () => {
      (getData as jest.Mock).mockResolvedValue(null);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const countryService = new CountryRepo("Spain");

      await expect(countryService.getCityPopulationFromAPI()).rejects.toThrow(
        "No city population data found"
      );
      await expect(countryService.getCityPopulationFromAPI()).rejects.toHaveProperty(
        "statusCode",
        404
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching city population data")
      );
    });

    it("should throw an error if the API call fails", async () => {
      const error = new Error("API Error");
      (getData as jest.Mock).mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const countryService = new CountryRepo("Spain");

      await expect(countryService.getCityPopulationFromAPI()).rejects.toThrow("API Error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Error fetching city population data")
      );
    });

    it.skip("should fall back to database when API call fails", async () => {
      const dbResponse = [
        {
          city: "London",
          country: "United Kingdom",
          population: "8,961,989"
        },
        {
          city: "Birmingham",
          country: "United Kingdom",
          population: "1,144,919"
        }
      ];

      const mockCountryResponse: CountryResponse[] = [
        {
          name: { common: "United Kingdom" },
          capital: ["London"],
          languages: { eng: "English" },
          currencies: { GBP: { name: "British Pound", symbol: "£" } },
          flags: { svg: "https://example.com/gb.svg" }
        }
      ];

      // Mock API to succeed for country details but fail for city population
      (getData as jest.Mock).mockImplementation((url: string) => {
        if (url.includes('geonames-all-cities')) {
          return Promise.reject(new Error("API Error"));
        }
        return Promise.resolve(mockCountryResponse);
      });
      mockDb.any.mockResolvedValue(dbResponse);

      const countryRepo = new CountryRepo("United Kingdom");
      const countryDomain = new CountryDomain(countryRepo);
      await countryDomain.getCountryData("United Kingdom");

      expect(mockDb.any).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM population")
      );
    });
  });
});
//});
