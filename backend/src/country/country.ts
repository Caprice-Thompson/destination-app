import { Country } from "../types";
import { getData } from "../api/client";

export const getCountryDetails = async (location: string) => {
  const url = `${process.env.COUNTRY_BASE_URL}${location}`;
  return await getData<Country>(url);
};
