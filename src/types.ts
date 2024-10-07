export interface Weather {
  id: number;
  location: string;
  temperature: number;
}

type Name = {
  common: string; // common name of the country
};

type Currency = {
  [key: string]: CurrencyDetail; // mapped to CurrencyDetail
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
  location: string;
  description: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
}
export interface ThingsToDo {
  location: string;
  item: string[];
}

export type Earthquake = {
  name: string;
  magnitude: string;
  date: string;
  type: string;
  tsunami: number;
};

export type Coordinates = {
  latitude: string;
  longitude: string;
};

//axios has own type - change to use export interface AxiosResponse<T = any, D = any> {
//   data: T;
//   status: number;
//   statusText: string;
//   headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
//   config: InternalAxiosRequestConfig<D>;
//   request?: any;
// }
