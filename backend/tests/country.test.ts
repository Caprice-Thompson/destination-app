import { apiClient } from "../src/api/apiClient";
import { getCountryDetails } from "../src/country/country";
import { Country } from "../src/types";

jest.mock("../src/api/apiClient");

describe("getCountryDetails", () => {
  const originalEnv = process.env;
  const location = "Spain";
  const mockUrl = `https://mocked-api.com/${location}`;
  const mockCountryDetails: Country[] = [
    {
      name: { common: "Spain" },
      capitalCity: ["City"],
      currencies: { EUR: { name: "Euro", symbol: "€" } },
      flag: "https://flag.com/es.png",
      languages: { name: "Spanish" },
    },
  ];

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      COUNTRY_BASE_URL: "https://mocked-api.com/",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });


  it("should return country details if the request is successful", async () => {
    (apiClient as jest.Mock).mockResolvedValue(mockCountryDetails);

    const result = await getCountryDetails(location);

    expect(result).toStrictEqual(mockCountryDetails);
    expect(apiClient).toHaveBeenCalledWith(mockUrl);
  });

  it("should return the status code if the request fails with an error status code", async () => {
    (apiClient as jest.Mock).mockResolvedValue(404);

    const result = await getCountryDetails(location);
    expect(result).toBe(404);
  });
});
