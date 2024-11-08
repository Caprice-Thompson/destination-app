import { Country } from "../types";
import { apiClient } from "../api/apiClient";

const COUNTRY_BASE_URL = process.env.COUNTRY_BASE_URL;

export const getCountryDetails = async (location: string) => {
  const url = `${COUNTRY_BASE_URL}${location}`;
  const countryDetails = await apiClient<Country>(url);

  return countryDetails;
};
