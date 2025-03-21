import { getData } from "../api/client";
import { getCustomURL } from "../api/getURL";
import { AppError } from "../utils/errorHandler";

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
  monthlyEarthquakePercentage: number;
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

export interface EarthquakeRepository {
  fetchEarthquakes(): Promise<Earthquake[]>;
}

export interface EarthquakeServiceInterface {
  getEarthquakeData: () => Promise<Earthquake[]>;
  calculateEarthquakeStatistics: (
    earthquakes: Earthquake[],
    targetMonth: number
  ) => EarthquakeStatistics;
}

export class EarthquakeService implements EarthquakeRepository {
  constructor(private readonly baseApiUrl: string, private readonly params: EarthquakeDataParams) {
    if (!baseApiUrl) {
      throw new AppError(400, 'Base API URL is required');
    }
  }

  async fetchEarthquakes(): Promise<Earthquake[]> {
    try {
      const url = getCustomURL.getParams(this.baseApiUrl, this.params);
      const response = await getData<EarthquakeResponse>(url);

      if (!response || !response.features) {
        throw new AppError(404, 'No earthquake data found');
      }

      return response.features.map(feature => this.mapToEarthquake(feature));
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      throw new AppError(500, 'Internal server error');
    }
  }

  private mapToEarthquake(feature: EarthquakeResponse['features'][0]): Earthquake {
    return {
      name: feature.properties.place,
      magnitude: feature.properties.mag,
      date: new Date(feature.properties.time).toISOString().split('T')[0],
      type: feature.properties.type,
      tsunami: feature.properties.tsunami,
    };
  }
}

export class EarthquakeDomain {
  constructor(private readonly earthquakeRepo: EarthquakeRepository) { }

  async getEarthquakeData(
    country: string | undefined,
    targetMonth: number
  ): Promise<{ earthquakeData: Earthquake[]; earthquakeStatistics: EarthquakeStatistics }> {
    if (!country || !targetMonth) {
      throw new AppError(400, "Country and target month parameters are required");
    }

    const earthquakeData = await this.earthquakeRepo.fetchEarthquakes();
    const earthquakeStatistics = this.calculateEarthquakeStatistics(earthquakeData, targetMonth);

    const sortedEarthquakes = earthquakeData
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return { earthquakeData: sortedEarthquakes, earthquakeStatistics };
  }

  private calculateEarthquakeStatistics(
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
        ? parseFloat(Math.round((totalEarthquakesInMonth / totalEarthquakes) * 100).toFixed(2))
        : 0;

    const avgTsunamis =
      totalEarthquakes > 0
        ? parseFloat((tsunamiCount / totalEarthquakes).toFixed(1))
        : 0;

    return {
      totalEarthquakes: totalEarthquakes,
      monthlyEarthquakePercentage: avgEarthquakesInAMonth,
      avgTsunamiCount: avgTsunamis,
      avgMagnitude: averageMagnitude,
    };
  }
}
