import { getData } from "../src/api/client";
import {
  Country,
  CountryResponse,
  CountryRepo,
} from "../src/services/CountryService";

jest.mock("../src/api/client");

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
    it("should return country details if the request is successful", async () => {
      const countryService = new CountryRepo("Spain");

    });
  });
});
//});
