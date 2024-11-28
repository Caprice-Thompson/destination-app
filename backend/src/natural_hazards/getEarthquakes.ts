import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";
import { EarthquakeDataAverages, EarthquakeDataParams } from "../types";

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

export function earthquakeData(
  earthquakeApiUrl: string,
): EarthquakeService {
  if (!earthquakeApiUrl) {
    throw new Error("Earthquake API URL is required");
  }

  return {
    getEarthquakeData: async (params: EarthquakeDataParams): Promise<Earthquake[]> => {
      console.info(
        "Fetching earthquake data with params",
        JSON.stringify(params),
      );

      const earthquakeURL = getCustomURL.getParams(earthquakeApiUrl, params);
      const eqData = await getData<EarthquakeResponse>(earthquakeURL);

      if (!eqData) {
        console.error("No data found");
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
  data: Earthquake[],
  month: number
): EarthquakeDataAverages => {
  let eqCount = 0;
  let sumMagnitude = 0;
  let tsunamiCount = 0;
  data.map((earthquake) => {
    const getMonth = new Date(earthquake.date).getMonth() + 1;
    if (getMonth === month) {
      if (earthquake.tsunami > 0) {
        tsunamiCount++;
      }
      if (earthquake.type === "earthquake") {
        if (!isNaN(earthquake.magnitude)) {
          sumMagnitude += Number(earthquake.magnitude);
        }
        eqCount++;
      }
    }
  });
  const totalEqs = data.length;
  const numberOfEqsInAMonth =
    totalEqs > 0 ? (eqCount / totalEqs).toFixed(2) : 0;
  const avgNumberOfTsunamis =
    totalEqs > 0 ? (tsunamiCount / totalEqs).toFixed(1).toString() : 0;
  const avgMagnitude = eqCount > 0 ? (sumMagnitude / eqCount).toFixed(1) : 0;

  return {
    totalNumberOfEqs: totalEqs,
    avgNumberOfEqsInAMonth: Number(numberOfEqsInAMonth),
    avgNumberOfTsunamis: Number(avgNumberOfTsunamis),
    avgMagnitude: Number(avgMagnitude),
  };
};
