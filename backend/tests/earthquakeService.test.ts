import { getData } from "../src/api/client";
import {
  Earthquake,
  EarthquakeStatistics,
  EarthquakeDataParams,
  EarthquakeService,
  EarthquakeDomain
} from "../src/services/EarthquakeService";
import { getCustomURL } from "../src/api/getURL";

jest.mock("../src/api/client");

describe("Earthquake Domain and Repository", () => {
  const baseURL = "https://mocked-earthquake-api.com";
  let consoleErrorSpy: jest.SpyInstance;

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

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });
  describe("EarthquakeService (Repository)", () => {
    it("should fetch earthquake data for valid parameters", async () => {
      (getData as jest.Mock).mockResolvedValue(mockResponse);

      const repository = new EarthquakeService(baseURL, params);
      const data = await repository.fetchEarthquakes();

      expect(data).toEqual(expectedData);
      expect(getData).toHaveBeenCalledWith(
        getCustomURL.getParams(baseURL, params)
      );
    });

    it("should throw error when no data is available", async () => {
      (getData as jest.Mock).mockResolvedValue({ features: null });

      const repository = new EarthquakeService(baseURL, params);
      await expect(repository.fetchEarthquakes()).rejects.toThrow(
        "Internal server error"
      );
    });

    it("should handle errors when API call fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
      const mockError = new Error("API Error");
      (getData as jest.Mock).mockRejectedValue(mockError);

      const repository = new EarthquakeService("http://test.com", {
        format: "geojson",
        longitude: "0",
        latitude: "0",
        startTime: "2021-01-01",
        endTime: "2021-12-31",
        maxRadius: 100,
      });

      await expect(repository.fetchEarthquakes()).rejects.toThrow(
        "Internal server error"
      );
      await expect(repository.fetchEarthquakes()).rejects.toHaveProperty(
        "statusCode",
        500
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching earthquake data:",
        expect.any(Error)
      );
    });
  });

  describe("EarthquakeDomain", () => {
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

    const mockRepository = {
      fetchEarthquakes: jest.fn().mockResolvedValue(mockData)
    };

    it("should return correct earthquake data and statistics", async () => {
      const domain = new EarthquakeDomain(mockRepository);
      const result = await domain.getEarthquakeData("TestCountry", 1);

      const expectedStats: EarthquakeStatistics = {
        totalEarthquakes: 4,
        avgEarthquakesInMonth: 0.75,
        avgTsunamiCount: 0.5,
        avgMagnitude: 6.2,
      };

      expect(result.earthquakeData).toEqual(mockData);
      expect(result.earthquakeStatistics).toStrictEqual(expectedStats);
    });

    it("should handle months with no earthquakes", async () => {
      const domain = new EarthquakeDomain(mockRepository);
      const result = await domain.getEarthquakeData("TestCountry", 12);

      const expectedStats: EarthquakeStatistics = {
        totalEarthquakes: 4,
        avgEarthquakesInMonth: 0,
        avgTsunamiCount: 0,
        avgMagnitude: 0,
      };

      expect(result.earthquakeStatistics).toStrictEqual(expectedStats);
    });

    it("should throw error when country or month is missing", async () => {
      const domain = new EarthquakeDomain(mockRepository);

      await expect(domain.getEarthquakeData(undefined, 1))
        .rejects
        .toThrow("Country and target month parameters are required");

      await expect(domain.getEarthquakeData("TestCountry", undefined as any))
        .rejects
        .toThrow("Country and target month parameters are required");
    });
  });
});
