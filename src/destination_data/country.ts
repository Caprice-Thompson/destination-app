import axios from "axios";
import { ApiError, ApiResponse, Country } from "../types";

export const fetchCountryData = async (location: string) => {
  try {
    const apiUrl = `https://restcountries.com/v3.1/name/${location}`;
    const { data } = await axios.get<ApiResponse<Country> | ApiError>(apiUrl);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      return { status: error.response?.status }; 
    } else {
      console.error("Unexpected error:", error);
      return { status: 500 }; 
    }
  }
};