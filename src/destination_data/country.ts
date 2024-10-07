import { Country } from "../types";
import { apiClient } from "../api/apiClient";

export const getCountryDetails = async (location: string) => {
  const url = `https://restcountries.com/v3.1/name/${location}`;
  const countryDetails = await apiClient<Country>(url);

  return countryDetails;
};
