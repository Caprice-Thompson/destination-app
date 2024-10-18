import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {
  Earthquake,
  EarthquakeDataAverages,
  EarthquakeDataParams,
} from "../src/types";
import {
  getEarthquakeData,
  averageEarthquakeData,
} from "../src/climate/getEarthquakes";

const EQ_ENDPOINT = process.env;

describe("Earthquake data", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  describe("Get Earthquake data from API", () => {
    it("should return earthquake data for valid coordinates", async () => {
      const params: EarthquakeDataParams = {
        longitude: "142.369",
        latitude: "-38.142",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        limit: 10,
      };

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

      const expectedData: Earthquake[] = mockResponse.features.map(
        (feature: any) => ({
          magnitude: feature.properties.mag,
          name: feature.properties.place,
          date: new Date(feature.properties.time).toISOString(),
          type: feature.properties.type,
          tsunami: feature.properties.tsunami,
        })
      );
      const EQ_ENDPOINT = process.env;
      const { startDate, endDate, latitude, longitude, limit } = params;
      const url = `${EQ_ENDPOINT}&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

      mock.onGet(url).reply(200, mockResponse);

      const data = await getEarthquakeData(params);
      expect(data).toEqual(expectedData);
    });
  });

  describe("Handle errors", () => {
    it("should handle errors if the API call fails", async () => {
      const params: EarthquakeDataParams = {
        longitude: "0",
        latitude: "0",
        startDate: "invalid-date",
        endDate: "invalid-date",
        limit: 10,
      };

      const { startDate, endDate, latitude, longitude, limit } = params;
      const url = `${EQ_ENDPOINT}&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

      mock.onGet(url).reply(400);

      jest.spyOn(console, "error").mockImplementation(() => {});

      await expect(getEarthquakeData(params)).rejects.toThrow();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("Get averages", () => {
    it("should return correct data for average number of earthquakes per month", async () => {
      const mockData = [
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
