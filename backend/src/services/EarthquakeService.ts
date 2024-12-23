import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";

export type EarthquakeDataParams = {
  format: string;
  longitude: string | undefined;
  latitude: string | undefined;
  startTime: string;
  endTime: string;
  maxRadius: number;
  limit?: number;
  minMagnitude?: number;
};

export type EarthquakeStatistics = {
  totalEarthquakes: number;
  avgEarthquakesInMonth: number;
  avgTsunamiCount: number;
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

export interface EarthquakeServiceInterface {
  getEarthquakeData: () => Promise<Earthquake[]>;
  calculateEarthquakeStatistics: (
    earthquakes: Earthquake[],
    targetMonth: number
  ) => EarthquakeStatistics;
}

class EarthquakeService implements EarthquakeServiceInterface {
  private earthquakeApiUrl: string;

  constructor(baseApiUrl: string, params: EarthquakeDataParams) {
    if (!baseApiUrl) {
      throw new Error("Base API URL is required");
    }
    this.earthquakeApiUrl = getCustomURL.getParams(baseApiUrl, params);
  }

  async getEarthquakeData(): Promise<Earthquake[]> {
    try {
      const response = await getData<EarthquakeResponse>(this.earthquakeApiUrl);

      if (!response || !response.features) {
        console.error("No earthquake data found");
        return [];
      }

      return response.features.map((feature) => ({
        name: feature.properties.place,
        magnitude: feature.properties.mag,
        date: new Date(feature.properties.time).toISOString(),
        type: feature.properties.type,
        tsunami: feature.properties.tsunami,
      }));
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      return [];
    }
  }

  calculateEarthquakeStatistics(
    earthquakes: Earthquake[],
    targetMonth: number
  ): EarthquakeStatistics {
    const totalEarthquakes = earthquakes.length;

    const earthquakesInMonth = earthquakes.filter(
      (eq) =>
        new Date(eq.date).getMonth() + 1 === targetMonth &&
        eq.type === "earthquake"
    );

    const totalEarthquakesInMonth = earthquakesInMonth.length;
    const tsunamiCount = earthquakesInMonth.filter(
      (eq) => eq.tsunami > 0
    ).length;
    const sumMagnitude = earthquakesInMonth.reduce(
      (sum, eq) => sum + (isNaN(eq.magnitude) ? 0 : eq.magnitude),
      0
    );

    const averageMagnitude =
      totalEarthquakesInMonth > 0
        ? parseFloat((sumMagnitude / totalEarthquakesInMonth).toFixed(1))
        : 0;

    const avgEarthquakesInAMonth =
      totalEarthquakes > 0
        ? parseFloat((totalEarthquakesInMonth / totalEarthquakes).toFixed(2))
        : 0;

    const avgTsunamis =
      totalEarthquakes > 0
        ? parseFloat((tsunamiCount / totalEarthquakes).toFixed(1))
        : 0;

    return {
      totalEarthquakes: totalEarthquakes,
      avgEarthquakesInMonth: avgEarthquakesInAMonth,
      avgTsunamiCount: avgTsunamis,
      avgMagnitude: averageMagnitude,
    };
  }
}

// Factory function to instantiate the service
export function launchEarthquakeService(
  baseApiUrl: string,
  params: EarthquakeDataParams
): EarthquakeServiceInterface {
  return new EarthquakeService(baseApiUrl, params);
}
