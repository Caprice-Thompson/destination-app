import { apiClient } from "../api/apiClient";
import {
  Earthquake,
  EarthquakeDataAverages,
  EarthquakeDataParams,
} from "../types";

// 2.5 to 5.4	Often felt, but only causes minor damage.	500,000
// 5.5 to 6.0	Slight damage to buildings and other structures.
export const getEarthquakeData = async (
  params: EarthquakeDataParams
): Promise<Earthquake[]> => {

  const { startDate, endDate, latitude, longitude, limit = 9000 } = params;

  const url = `${process.env.EQ_BASE_URL}&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}&minmagnitude=4`;

  const eqData = await apiClient<any>(url);

  const earthquakeData: Earthquake[] = eqData.features.map((feature: any) => ({
    name: feature.properties.place,
    magnitude: feature.properties.mag,
    date: new Date(feature.properties.time).toISOString(),
    type: feature.properties.type,
    tsunami: feature.properties.tsunami,
  }));

  return earthquakeData;
};

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

  const results: EarthquakeDataAverages = {
    totalNumberOfEqs: totalEqs,
    avgNumberOfEqsInAMonth: Number(numberOfEqsInAMonth),
    avgNumberOfTsunamis: Number(avgNumberOfTsunamis),
    avgMagnitude: Number(avgMagnitude),
  };

  return results;
};
