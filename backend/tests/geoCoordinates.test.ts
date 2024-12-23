import { Coordinates, getGeoCoordinates } from "../src/utils/getGeoCoordinates";
import { getData } from "../src/api/client";

jest.mock("../src/api/client");

describe("Geo Coordinates", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      GEO_ENDPOINT: "https://mocked-api.com/",
      GEO_TOKEN: "mocked-token",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Getting Geo Coordinates", () => {
    const location = "Spain";
    const mockUrl = `https://mocked-api.com/${location}?json=1&auth=mocked-token`;

    it("should return coordinates when API call is successful", async () => {
      const mockApiResponse: Coordinates = {
        latt: "51.51415",
        longt: "-0.11473",
      };
      (getData as jest.Mock).mockResolvedValue(mockApiResponse);

      const result = await getGeoCoordinates(location);
      expect(getData).toHaveBeenCalledWith(mockUrl);
      expect(result).toEqual(mockApiResponse);
    });
  });

  describe("Handle errors", () => {
    const location = "InvalidLocation";
    const mockUrl = `https://mocked-api.com/${location}?json=1&auth=mocked-token`;

    it("should handle API errors gracefully", async () => {
      (getData as jest.Mock).mockRejectedValue(new Error("API Error"));

      await expect(getGeoCoordinates(location)).rejects.toThrow("API Error");
      expect(getData).toHaveBeenCalledWith(mockUrl);
    });
  });
});
