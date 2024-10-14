import { apiClient } from "../api/apiClient";
import { Earthquake, EarthquakeDataAverages } from "../types";

export interface EarthquakeDataParams {
  longitude: string;
  latitude: string;
  startDate: string;
  endDate: string;
  limit?: number;
}
// api
// orderby
// alert level
// minmagnitude
// 2.5 to 5.4	Often felt, but only causes minor damage.	500,000
// 5.5 to 6.0	Slight damage to buildings and other structures.
export const getEarthquakeData = async (
  params: EarthquakeDataParams
): Promise<Earthquake[]> => {
  const { startDate, endDate, latitude, longitude, limit = 9000 } = params;
  const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startDate}&endtime=${endDate}&latitude=${latitude}&longitude=${longitude}&maxradius=3&limit=${limit}`;

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

// get average number of earthquakes for a month
// get avg number of eqs + mag +tsunamis
// output:
// Average number of eqs
// average mag of eqs
// avg number of tsunamis
export const averageEarthquakeData = (
  data: Earthquake[],
  month: number
): EarthquakeDataAverages => {
  let eqCount = 0;
  let sumMagnitude = 0;
  let tsunamiCount = 0;
  data.map((earthquake) => {
    // 0 = jan
    //11 == dec
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

  const results: EarthquakeDataAverages =
  {
    totalNumberOfEqs: totalEqs,
    avgNumberOfEqsInAMonth: Number(numberOfEqsInAMonth),
    avgNumberOfTsunamis: Number(avgNumberOfTsunamis),
    avgMagnitude: Number(avgMagnitude),
  };

  return results;
};
