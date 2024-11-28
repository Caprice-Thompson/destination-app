import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";

// TODO: Earthquake Factory function
/**
 * Define interface for getting EQ data, input: url, output: api response
 * create function that returns the interface and inside also fetches the data
 * Then create another function that uses the factory function to get the data
 */
// TODO: Implement logger
/**
 * Research some
 */
// TODO: Define EQ Info
/**
 * 2.5 to 5.4	Often felt, but only causes minor damage.	500,000
 * 5.5 to 6.0	Slight damage to buildings and other structures.
 */
export type EarthquakeDataParams = {
  longitude: string;
  latitude: string;
  startTime: string;
  endTime: string;
  maxRadius: number;
  limit?: number;
  minMagnitude?: number;
};

export type EarthquakeDataAverages = {
  totalNumberOfEqs: number;
  avgNumberOfEqsInAMonth: number;
  avgNumberOfTsunamis: number;
  avgMagnitude: number;
};

export type EarthquakeResponse = {
  features: {
    properties: {
      mag: number;
      place: string;
      time: number;
      updated: number;
      tsunami: number;
      type: string;
    };
  }[];
};

export type Earthquake = {
  name: string;
  magnitude: number;
  date: string;
  type: string;
  tsunami: number;
};

export interface EarthquakeService {
  getEarthquakeData: (params: EarthquakeDataParams) => Promise<Earthquake[]>;
}

export function earthquakeData(earthquakeApiUrl: string): EarthquakeService {
  if (!earthquakeApiUrl) {
    throw new Error("Earthquake API URL is required");
  }

  return {
    getEarthquakeData: async (
      params: EarthquakeDataParams
    ): Promise<Earthquake[]> => {
      console.info(
        "Fetching earthquake data with params",
        JSON.stringify(params)
      );

      const earthquakeURL = getCustomURL.getParams(earthquakeApiUrl, params);
      const eqData = await getData<EarthquakeResponse>(earthquakeURL);

      if (!eqData) {
        console.error("No earthquake data found");
        return [];
      }

      return eqData.features.map((feature) => ({
        name: feature.properties.place,
        magnitude: feature.properties.mag,
        date: new Date(feature.properties.time).toISOString(),
        type: feature.properties.type,
        tsunami: feature.properties.tsunami,
      }));
    },
  };
}

export const averageEarthquakeData = (
  earthquakes: Earthquake[],
  targetMonth: number
): EarthquakeDataAverages => {
  const totalEarthquakes = earthquakes.length;

  const earthquakesInMonth = earthquakes.filter((eq) => {
    const earthquakeMonth = new Date(eq.date).getMonth() + 1;
    return earthquakeMonth === targetMonth && eq.type === "earthquake";
  });

  const totalEarthquakesInMonth = earthquakesInMonth.length;

  const tsunamiCount = earthquakesInMonth.reduce(
    (count, eq) => count + (eq.tsunami > 0 ? 1 : 0),
    0
  );

  const sumMagnitude = earthquakesInMonth.reduce(
    (sum, eq) => sum + (isNaN(eq.magnitude) ? 0 : eq.magnitude),
    0
  );

  const averageMagnitude =
    totalEarthquakesInMonth > 0
      ? parseFloat((sumMagnitude / totalEarthquakesInMonth).toFixed(1))
      : 0;

  const averageEarthquakesInMonth =
    totalEarthquakes > 0
      ? parseFloat((totalEarthquakesInMonth / totalEarthquakes).toFixed(2))
      : 0;

  const averageTsunamis =
    totalEarthquakes > 0
      ? parseFloat((tsunamiCount / totalEarthquakes).toFixed(1))
      : 0;

  return {
    totalNumberOfEqs: totalEarthquakes,
    avgNumberOfEqsInAMonth: averageEarthquakesInMonth,
    avgNumberOfTsunamis: averageTsunamis,
    avgMagnitude: averageMagnitude,
  };
};

