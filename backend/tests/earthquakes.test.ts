import { getData } from "../src/api/client";
import {
  Earthquake,
  EarthquakeDataAverages,
  EarthquakeDataParams,
  launchEarthquakeService,
} from "../src/natural_hazards/EarthquakeService";
import { getCustomURL } from "../src/api/getURL";

jest.mock("../src/api/client");

describe("Earthquake data", () => {
  const originalEnv = process.env;
  const baseURL = `https://mocked-earthquake-api.com`;

  beforeAll(async () => {
    process.env = {
      ...originalEnv,
      EQ_BASE_URL: "https://mocked-earthquake-api.com",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Earthquake data retrieval", () => {
    const params: EarthquakeDataParams = {
      format: "geojson",
      startTime: "2023-01-01",
      endTime: "2023-12-31",
      latitude: "-38.142",
      longitude: "142.369",
      maxRadius: 3,
      limit: 10,
      minMagnitude: 4,
    };

    const earthquakeURL = getCustomURL.getParams(baseURL, params);

    it("should return earthquake data for valid coordinates", async () => {
      const mockResponse = {
        features: [
          {
            properties: {
              mag: 5.2,
              place: "100km SSW of XYZ",
              time: 1625247600000,
              type: "earthquake",
              tsunami: 0,
            },
          },
        ],
      };

      const expectedData: Earthquake[] = [
        {
          magnitude: 5.2,
          name: "100km SSW of XYZ",
          date: new Date(1625247600000).toISOString(),
          type: "earthquake",
          tsunami: 0,
        },
      ];

      (getData as jest.Mock).mockResolvedValue(mockResponse);
      const earthquakeService = launchEarthquakeService(baseURL, params);
      const data = await earthquakeService.getEarthquakeData();
      expect(data).toEqual(expectedData);
    });

    describe("Handle errors", () => {
      const params: EarthquakeDataParams = {
        format: "geojson",
        longitude: "0",
        latitude: "0",
        startTime: "invalid-date",
        endTime: "invalid-date",
        limit: 10,
        maxRadius: 3,
      };
      const earthquakeURL = getCustomURL.getParams(baseURL, params);

      it("should handle errors if the API call fails", async () => {
        (getData as jest.Mock).mockRejectedValue(new Error("API Error"));
        const earthquakeService = launchEarthquakeService(baseURL, params);
        await expect(earthquakeService.getEarthquakeData()).rejects.toThrow(
          "API Error"
        );
      });
    });

    describe("Get averages", () => {
      it("should return correct data for average number of earthquakes per month", () => {
        const mockData: Earthquake[] = [
          {
            magnitude: 5.2,
            name: "50km SSW of XYZ",
            date: "2022-01-20T11:00:00.000Z",
            type: "earthquake",
            tsunami: 0,
          },
          {
            magnitude: 7.4,
            name: "100km SSW of XYZ",
            date: "2022-01-04T11:00:00.000Z",
            type: "earthquake",
            tsunami: 1,
          },
          {
            magnitude: 6.1,
            name: "200km SSW of XYZ",
            date: "2022-01-02T11:00:00.000Z",
            type: "earthquake",
            tsunami: 3,
          },
          {
            magnitude: 8.1,
            name: "100km SSW of XYZ",
            date: "2022-04-02T11:00:00.000Z",
            type: "earthquake",
            tsunami: 3,
          },
        ];

        const expectedData: EarthquakeDataAverages = {
          totalEarthquakes: 4,
          avgEarthquakesInMonth: 0.75,
          avgTsunamiCount: 0.5,
          avgMagnitude: 6.2,
        };
        const earthquakeService = launchEarthquakeService(
          baseURL,
          params
        );
        const result = earthquakeService.calculateEarthquakeStatistics(
          mockData,
          1
        );
        expect(result).toStrictEqual(expectedData);
      });
    });
  });
});
