import { Country } from "../types";
import { apiClient } from "../api/apiClient";

export const getCountryDetails = async (location: string) => {
  const url = `${process.env.COUNTRY_BASE_URL}${location}`;
  const countryDetails = await apiClient<Country>(url);

  return countryDetails;
};
