export type CityPopulation = {
    city: string;
    country: string;
    population: string;
}

export type LanguageDetail = {
    name: string;
};

export type ThingsToDo = {
    location: string;
    item: string[];
}

export type UNESCOSite = {
    site: string;
    area: string;
    country: string;
    description: string;
}

export type Volcano = {
    name: string;
    region: string;
    country: string;
};

export type Earthquake = {
    name: string;
    magnitude: number;
    date: string;
    type: string;
    tsunami: number;
};

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