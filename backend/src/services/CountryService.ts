import { getData } from "../api/client";
import { getPopulation } from "../db/dbQueries";
import { AppError } from "../utils/errorHandler";

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

export type Country = {
  name: string;
  capitalCity: string[];
  languages: LanguageDetail[];
  currencies: Currencies;
  flag: string;
};

export type CountryResponse = {
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

    try {
      const response = await getData<CountryResponse[]>(countryUrl);

      if (!response || response.length === 0) {
        console.error(`No data returned from API for URL: ${countryUrl}`);
        throw new AppError(404, "No country data found");
      }

      const [data] = response;

      const mappedCountry: Country = {
        name: data.name.common,
        capitalCity: data.capital,
        languages: Object.values(data.languages).map((lang) => ({
          name: lang,
        })),
        currencies: Object.entries(data.currencies).reduce(
          (acc, [key, details]) => ({
            ...acc,
            [key]: { name: details.name, symbol: details.symbol },
          }),
          {} as Currencies
        ),
        flag: data.flags.svg,
      };

      return mappedCountry;
    } catch (error) {
      console.error(`Error fetching country details: ${error}`);
      throw error;
    }
  }

  async getCityPopulation(): Promise<CityPopulation[]> {
    const cityPopulations = await getPopulation(this.country);
    return cityPopulations;
  }

  // async getCountryData(): Promise<CountryServiceInterface> {
  //   const countryDetails = await this.getCountryDetails();
  //   const cityPopulations = await this.getCityPopulation();
  //   return { countryDetails, cityPopulations };
  // }
}
