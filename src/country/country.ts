import { Country } from "../types";
import { apiClient } from "../api/apiClient";

const COUNTRY_ENDPOINT = process.env;

export const getCountryDetails = async (location: string) => {
  const url = `${COUNTRY_ENDPOINT}${location}`;
  const countryDetails = await apiClient<Country>(url);

  return countryDetails;
};
