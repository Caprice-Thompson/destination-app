import { getGeoCoordinates } from "../src/natural_hazards/getGeoCoordinates";
import { apiClient } from "../src/api/apiClient";
import { Coordinates } from "../src/types";

jest.mock("../src/api/apiClient");
const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

describe("Getting Geo Coordinates", () => {
  it("should return coordinates when API call is successful", async () => {
    const mockApiResponse: Coordinates = {
      latitude: "51.51415",
      longitude: "-0.11473",
    };
    mockedApiClient.mockResolvedValue(mockApiResponse);

    const location = "Spain";

    const coordinates = await getGeoCoordinates(location);
    expect(coordinates).toEqual({
      latitude: mockApiResponse.latitude,
      longitude: mockApiResponse.longitude,
    });
  });
});

describe("Handle errors", () => {
  it("should handle API errors gracefully", async () => {
    mockedApiClient.mockRejectedValue(new Error("API Error"));

    const location = "InvalidLocation";

    await expect(getGeoCoordinates(location)).rejects.toThrow(
      "API Error"
    );
  });
});
