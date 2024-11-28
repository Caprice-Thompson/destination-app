import { Country } from "../types";
import { getData } from "../api/client";

export const getCountryDetails = async (location: string) => {
  const countryBaseUrl = process.env.COUNTRY_BASE_URL ?? "";
  const endpointPath = `${location}`;
  const countryUrl = new URL(endpointPath, countryBaseUrl);

  return await getData<Country>(countryUrl.toString());
};
