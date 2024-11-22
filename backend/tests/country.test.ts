import { apiClient } from "../src/api/apiClient";
import { getCountryDetails } from "../src/country/country";
import { Country } from "../src/types";

jest.mock("../src/api/apiClient", () => ({
  apiClient: jest.fn(),
}));

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

beforeAll(async () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    COUNTRY_BASE_URL: "https://mocked-api.com/",
  };
});

describe("getCountryDetails", () => {
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

  it("should return country details if the request is successful", async () => {
    mockedApiClient.mockResolvedValue(mockCountryDetails);

    const result = await getCountryDetails(location);
    expect(result).toEqual(mockCountryDetails);
    expect(mockedApiClient).toHaveBeenCalledWith(mockUrl);
  });

  it("should return undefined if the request fails", async () => {
    mockedApiClient.mockResolvedValue(undefined);

    const result = await getCountryDetails(location);
    expect(result).toBeUndefined();
  });

  it("should return the status code if the request fails with an error status code", async () => {
    mockedApiClient.mockResolvedValue(404);

    const result = await getCountryDetails(location);
    expect(result).toBe(404);
  });
});
