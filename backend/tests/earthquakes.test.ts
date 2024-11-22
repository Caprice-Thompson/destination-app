import { apiClient } from "../src/api/apiClient";
import {
  Earthquake,
  EarthquakeDataAverages,
  EarthquakeDataParams,
} from "../src/types";
import {
  getEarthquakeData,
  averageEarthquakeData,
} from "../src/natural_hazards/getEarthquakes";

jest.mock("../src/api/apiClient");

describe("Earthquake data", () => {
  const originalEnv = process.env;

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
      longitude: "142.369",
      latitude: "-38.142",
      startDate: "2023-01-01",
      endDate: "2023-12-31",
      limit: 10,
    };
    const mockUrl = `https://mocked-earthquake-api.com&starttime=${params.startDate}&endtime=${params.endDate}&latitude=${params.latitude}&longitude=${params.longitude}&maxradius=3&limit=${params.limit}&minmagnitude=4`;

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

      (apiClient as jest.Mock).mockResolvedValue(mockResponse);

      const data = await getEarthquakeData(params);
      expect(data).toEqual(expectedData);
      expect(apiClient).toHaveBeenCalledWith(mockUrl);
    });

    describe("Handle errors", () => {

      const params: EarthquakeDataParams = {
        longitude: "0",
        latitude: "0",
        startDate: "invalid-date",
        endDate: "invalid-date",
        limit: 10,
      };

      const mockUrl = `https://mocked-earthquake-api.com&starttime=${params.startDate}&endtime=${params.endDate}&latitude=${params.latitude}&longitude=${params.longitude}&maxradius=3&limit=${params.limit}&minmagnitude=4`;
      it("should handle errors if the API call fails", async () => {

        (apiClient as jest.Mock).mockRejectedValue(new Error("API Error"));

        await expect(getEarthquakeData(params)).rejects.toThrow("API Error");
        expect(apiClient).toHaveBeenCalledWith(mockUrl);
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
          totalNumberOfEqs: 4,
          avgNumberOfEqsInAMonth: 0.75,
          avgNumberOfTsunamis: 0.5,
          avgMagnitude: 6.2,
        };

        const result = averageEarthquakeData(mockData, 1);
        expect(result).toStrictEqual(expectedData);
      });
    });
  });
});