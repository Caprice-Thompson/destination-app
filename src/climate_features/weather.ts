import axios from "axios";
import { ApiError, ApiResponse, Weather } from "../types";

export const fetchWeatherData = async () => {
  try {
    const apiUrl = 'https://jsonplaceholder.typicode.com/users';
    const { data } = await axios.get<ApiResponse<Weather> | ApiError>(apiUrl);
    return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
};
fetchWeatherData();
