import { getData } from "../api/client";
import { getPopulation } from "../db/dbQueries";

export interface CityPopulation {
  city: string;
  country: string;
  population: string;
}

type Currency = {
  name: string;
  symbol: string;
};

type Currencies = {
  [key: string]: Currency;
};

type LanguageDetail = {
  name: string;
};

export interface Country {
  name: string;
  capitalCity: string[];
  languages: LanguageDetail[];
  currencies: Currencies;
  flag: string;
}

type CountryResponse = {
  name: { common: string };
  capital: string[];
  languages: Record<string, string>;
  currencies: { [key: string]: { name: string; symbol: string } };
  flags: { svg: string };
};

interface CountryServiceInterface {
  getCountryDetails: (country: string) => Promise<Country>;
  getCityPopulation: (country: string) => Promise<CityPopulation[]>;
}

export class CountryService implements CountryServiceInterface {
  country: string;

  constructor(country: string) {
    this.country = country;
  }

  async getCountryDetails(): Promise<Country> {
    const countryBaseUrl = process.env.COUNTRY_BASE_URL ?? "";
    const countryUrl = `${countryBaseUrl}/${this.country}`;
    const response = await getData<CountryResponse[]>(countryUrl);

    if (!response || response.length === 0) {
      throw new Error("No country data found.");
    }

    const [data] = response;

    return {
      name: data.name.common,
      capitalCity: data.capital,
      languages: Object.values(data.languages).map((lang) => ({ name: lang })),
      currencies: Object.entries(data.currencies).reduce(
        (acc, [key, details]) => {
          acc[key] = {
            name: details.name as string,
            symbol: details.symbol as string,
          };
          return acc;
        },
        {} as Currencies
      ),
      flag: data.flags.svg,
    };
  }

  async getCityPopulation(): Promise<CityPopulation[]> {
    const cityPopulations = await getPopulation(this.country);
    return cityPopulations;
  }
}
