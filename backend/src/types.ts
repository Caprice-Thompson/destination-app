export interface Weather {
  id: number;
  location: string;
  temperature: number;
}

type Name = {
  common: string; 
};

type Currency = {
  [key: string]: CurrencyDetail; 
};

type CurrencyDetail = {
  name: string;
  symbol: string;
};

type LanguageDetail = {
  name: string;
};
export interface Country {
  name: Name;
  capitalCity: string[];
  languages: LanguageDetail;
  currencies: Currency;
  flag: string;
}

export interface Population {
  city: string;
  country: string;
  population: string;
}

export interface WorldHeritageSiteData {
  site: string;
  area: string;
  country: string;
  description: string;
}
export interface ThingsToDo {
  location: string;
  item: string[];
}

export type Earthquake = {
  name: string;
  magnitude: number;
  date: string;
  type: string;
  tsunami: number;
};

export type EarthquakeDataAverages = {
  totalNumberOfEqs: number;
  avgNumberOfEqsInAMonth: number;
  avgNumberOfTsunamis: number;
  avgMagnitude: number;
};

export type Coordinates = {
  latitude: string;
  longitude: string;
};

export type Volcano = {
  name: string;
  region: string;
  country: string;
};

export interface Service<T> {
  data: T;
}
export type NaturalHazard = {
  volcano: Volcano[];
  earthquake: Earthquake[];
  earthquakeAverages: EarthquakeDataAverages;
};

export type EarthquakeDataParams = {
  longitude: string;
  latitude: string;
  startDate: string;
  endDate: string;
  limit?: number;
};
