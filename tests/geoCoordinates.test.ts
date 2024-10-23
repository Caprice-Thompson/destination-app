import { getGeoCoordinates } from "../src/natural_hazards/getGeoCoordinates";
import { apiClient } from "../src/api/apiClient";
import { AxiosResponse } from "axios";

jest.mock("../src/api/apiClient");
const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

describe("Getting Geo Coordinates", () => {
  it("should return coordinates when API call is successful", async () => {
    const mockApiResponse: Pick<AxiosResponse<any>, "data" | "status"> = {
      data: {
        latt: "51.51415",
        longt: "-0.11473",
      },
      status: 200,
    };
    mockedApiClient.mockResolvedValue(mockApiResponse);

    const location = "London";

    const coordinates = await getGeoCoordinates(location);
    expect(coordinates).toEqual({
      latitude: mockApiResponse.data.latt,
      longitude: mockApiResponse.data.longt,
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
