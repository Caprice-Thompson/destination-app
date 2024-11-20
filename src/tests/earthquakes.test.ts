import { apiClient } from "../api/apiClient";
import {
  Earthquake,
  EarthquakeDataAverages,
  EarthquakeDataParams,
} from "../types";
import {
  getEarthquakeData,
  averageEarthquakeData,
} from "../natural_hazards/getEarthquakes";

jest.mock("../api/apiClient");

const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;
beforeAll(async () => {
  const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    EQ_BASE_URL: "https://mocked-earthquake-api.com",
  };
});

afterAll(() => {
  delete process.env.EQ_BASE_URL;
});

describe("Earthquake data", () => {
  const params: EarthquakeDataParams = {
    longitude: "142.369",
    latitude: "-38.142",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    limit: 10,
  };

  const mockUrl = `${process.env.EQ_BASE_URL}?starttime=${params.startDate}&endtime=${params.endDate}&latitude=${params.latitude}&longitude=${params.longitude}&maxradius=3&limit=${params.limit}&minmagnitude=4`;

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

    mockedApiClient.mockResolvedValue(mockResponse);

    const data = await getEarthquakeData(params);
    expect(data).toEqual(expectedData);
    expect(mockedApiClient).toHaveBeenCalledWith(mockUrl);
  });

  describe("Handle errors", () => {
    const params: EarthquakeDataParams = {
      longitude: "0",
      latitude: "0",
      startDate: "invalid-date",
      endDate: "invalid-date",
      limit: 10,
    };
    const { startDate, endDate, latitude, longitude, limit } = params;
    const mockUrl = `${process.env.EQ_BASE_URL}?starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}&minmagnitude=4`;
    it("should handle errors if the API call fails", async () => {

      mockedApiClient.mockRejectedValue(new Error("API Error"));

      jest.spyOn(console, "error").mockImplementation(() => { });

      await expect(getEarthquakeData(params)).rejects.toThrow("API Error");
      expect(mockedApiClient).toHaveBeenCalledWith(mockUrl);
      expect(console.error).toHaveBeenCalledWith(
        `Error with request to ${mockUrl}:`,
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