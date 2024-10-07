import { GeoApiResponse, getGeoCoordinates } from "../src/climate_features/getGeoCoordinates";
import { apiClient } from "../src/api/apiClient";
import { ApiResponse } from "../src/types";

jest.mock("../src/api/apiClient");
const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

describe("getGeoCoordinates", () => {
    it("should return coordinates when API call is successful", async () => {
        const mockApiResponse: ApiResponse<GeoApiResponse> = {
            data: {
                latt: "51.51415",
                longt: "-0.11473",
            },
            status: 200,
        };
        mockedApiClient.mockResolvedValue(mockApiResponse);

        const location = "London";
        const token = process.env.AUTH_TOKEN || "";

        const coordinates = await getGeoCoordinates(location, token);
        expect(coordinates).toEqual({
            latitude: mockApiResponse.data.latt,
            longitude: mockApiResponse.data.longt,
        });
    });

    it("should handle API errors gracefully", async () => {
        mockedApiClient.mockRejectedValue(new Error("API Error"));

        const location = "InvalidLocation";
        const token = "test-token";

        await expect(getGeoCoordinates(location, token)).rejects.toThrow(
            "API Error"
        );
    });
});
