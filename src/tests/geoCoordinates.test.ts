import { getGeoCoordinates } from "../natural_hazards/getGeoCoordinates";
import { apiClient } from "../api/apiClient";
import { Coordinates } from "../types";

jest.mock("../api/apiClient");

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
process.env.GEO_ENDPOINT = "https://mocked-api.com/";
process.env.GEO_TOKEN = "0123456789";

beforeAll(async () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    GEO_ENDPOINT: "https://mocked-api.com/",
    GEO_TOKEN: "0123456789",
  };
});

describe("Getting Geo Coordinates", () => {
  const location = "Spain";
  const mockUrl = `${process.env.GEO_ENDPOINT}${location}?json=1&auth=${process.env.GEO_TOKEN}`;

  it("should return coordinates when API call is successful", async () => {
    const mockApiResponse: Coordinates = {
      latitude: "51.51415",
      longitude: "-0.11473",
    };

    mockedApiClient.mockResolvedValueOnce(mockApiResponse);

    const result = await getGeoCoordinates(location);
    expect(result).toEqual(mockApiResponse);
    expect(mockedApiClient).toHaveBeenCalledWith(mockUrl);
  });
});

describe("Handle errors", () => {
  it("should handle API errors gracefully", async () => {
    mockedApiClient.mockRejectedValue(new Error("API Error"));

    const location = "InvalidLocation";

    await expect(getGeoCoordinates(location)).rejects.toThrow("API Error");
    expect(mockedApiClient).toHaveBeenCalledWith(
      `${process.env.GEO_ENDPOINT}${location}?json=1&auth=${process.env.GEO_TOKEN}`
    );
  });
});