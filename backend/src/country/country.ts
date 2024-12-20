import { getData } from "../api/client";

type Name = {
  common: string;
};

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
  name: Name;
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

export const getCountryDetails = async (location: string): Promise<Country> => {
  const countryBaseUrl = process.env.COUNTRY_BASE_URL ?? "";
  const countryUrl = `${countryBaseUrl}/${location}`;
  const response = (await getData(countryUrl)) as CountryResponse[];

  if (!response || response.length === 0) {
    throw new Error("No country data found.");
  }

  const [data] = response;

  return {
    name: { common: data.name.common },
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
};
