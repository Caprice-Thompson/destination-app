import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Earthquake } from "../src/types";
import {
  getEarthquakeData,
  EarthquakeDataParams,
} from "../src/climate_features/getEarthquakes";

describe("Get Earthquake data from API", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

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
        magnitude: feature.properties.mag.toString(),
        name: feature.properties.place,
        date: new Date(feature.properties.time).toISOString(),
        type: feature.properties.type,
        tsunami: feature.properties.tsunami,
      })
    );

    const { startDate, endDate, latitude, longitude, limit } = params;
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

    mock.onGet(url).reply(200, mockResponse);

    const data = await getEarthquakeData(params);
    expect(data).toEqual(expectedData);
  });

  it("should handle errors if the API call fails", async () => {
    const params: EarthquakeDataParams = {
      longitude: "0",
      latitude: "0",
      startDate: "invalid-date",
      endDate: "invalid-date",
      limit: 10,
    };

    const { startDate, endDate, latitude, longitude, limit } = params;
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

    mock.onGet(url).reply(400);

    jest.spyOn(console, "error").mockImplementation(() => { });

    await expect(getEarthquakeData(params)).rejects.toThrow();
    expect(console.error).toHaveBeenCalled();
  });
});
