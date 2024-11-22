import { getGeoCoordinates } from "../src/natural_hazards/getGeoCoordinates";
import { apiClient } from "../src/api/apiClient";
import { Coordinates } from "../src/types";

jest.mock("../src/api/apiClient");

describe("Geo Coordinates", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = { ...originalEnv, GEO_ENDPOINT: "https://mocked-api.com/", GEO_TOKEN: "mocked-token" };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Getting Geo Coordinates", () => {
    const location = "Spain";
    const mockUrl = `https://mocked-api.com/${location}?json=1&auth=mocked-token`;

    it("should return coordinates when API call is successful", async () => {
      const mockApiResponse: Coordinates = {
        latitude: "51.51415",
        longitude: "-0.11473",
      };
      (apiClient as jest.Mock).mockResolvedValue(mockApiResponse);

      const result = await getGeoCoordinates(location);
      expect(apiClient).toHaveBeenCalledWith(mockUrl);
      expect(result).toEqual(mockApiResponse);
    });
  });

  describe("Handle errors", () => {
    const location = "InvalidLocation";
    const mockUrl = `https://mocked-api.com/${location}?json=1&auth=mocked-token`;

    it("should handle API errors gracefully", async () => {
      (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(getGeoCoordinates(location)).rejects.toThrow("API Error");
      expect(apiClient).toHaveBeenCalledWith(mockUrl);
    });
  });
});