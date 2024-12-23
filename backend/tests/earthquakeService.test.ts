import { getData } from "../src/api/client";
import {
  Earthquake,
  EarthquakeStatistics,
  EarthquakeDataParams,
  launchEarthquakeService,
} from "../src/services/EarthquakeService";
import { getCustomURL } from "../src/api/getURL";

jest.mock("../src/api/client");

describe("EarthquakeService", () => {
  const baseURL = "https://mocked-earthquake-api.com";

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

  const mockResponse = {
    features: [
      {
        properties: {
          mag: 5.2,
          place: "100km SSW of XYZ",
          time: 1625247600000,
          type: "earthquake",
          tsunami: 1,
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
      tsunami: 1,
    },
  ];

  describe("getEarthquakeData", () => {
    it("should return earthquake data for valid parameters", async () => {
      (getData as jest.Mock).mockResolvedValue(mockResponse);

      const earthquakeService = launchEarthquakeService(baseURL, params);
      const data = await earthquakeService.getEarthquakeData();

      expect(data).toEqual(expectedData);
      expect(getData).toHaveBeenCalledWith(
        getCustomURL.getParams(baseURL, params)
      );
    });

    it("should return an empty array when no data is available", async () => {
      (getData as jest.Mock).mockResolvedValue({ features: [] });

      const earthquakeService = launchEarthquakeService(baseURL, params);
      const data = await earthquakeService.getEarthquakeData();

      expect(data).toEqual([]);
    });

    it("should handle errors when API call fails", async () => {
      const errorMessage = "API Error";
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (getData as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const earthquakeService = launchEarthquakeService(baseURL, params);
      const data = await earthquakeService.getEarthquakeData();

      expect(data).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching earthquake data:",
        expect.objectContaining(new Error(errorMessage))
      );
    });
  });

  describe("calculateEarthquakeStatistics", () => {
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

    it("should return correct statistics for a specific month", () => {
      const expectedStats: EarthquakeStatistics = {
        totalEarthquakes: 4,
        avgEarthquakesInMonth: 0.75,
        avgTsunamiCount: 0.5,
        avgMagnitude: 6.2,
      };

      const earthquakeService = launchEarthquakeService(baseURL, params);
      const stats = earthquakeService.calculateEarthquakeStatistics(
        mockData,
        1 
      );

      expect(stats).toStrictEqual(expectedStats);
    });

    it("should handle cases with no earthquakes in the target month", () => {
      const expectedStats: EarthquakeStatistics = {
        totalEarthquakes: 4,
        avgEarthquakesInMonth: 0,
        avgTsunamiCount: 0,
        avgMagnitude: 0,
      };

      const earthquakeService = launchEarthquakeService(baseURL, params);
      const stats = earthquakeService.calculateEarthquakeStatistics(
        mockData,
        12 
      );

      expect(stats).toStrictEqual(expectedStats);
    });
  });
});
