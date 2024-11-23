import {Country} from "../types";
import {apiClient} from "../api/apiClient";

export const getCountryDetails = async (location: string) => {
  const url = `${process.env.COUNTRY_BASE_URL}${location}`;
  return await apiClient<Country>(url);
};
