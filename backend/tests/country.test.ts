import { getData } from "../src/api/client";
import { Country, getCountryDetails } from "../src/country/country";

jest.mock("../src/api/client");

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
      languages: [{ name: "Spanish" }],
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
    (getData as jest.Mock).mockResolvedValue(mockCountryDetails);

    const result = await getCountryDetails(location);

    expect(result).toStrictEqual(mockCountryDetails);
    expect(getData).toHaveBeenCalledWith(mockUrl);
  });

  it("should return the status code if the request fails with an error status code", async () => {
    (getData as jest.Mock).mockResolvedValue(404);

    const result = await getCountryDetails(location);
    expect(result).toBe(404);
  });
});
