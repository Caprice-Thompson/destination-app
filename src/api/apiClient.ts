import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiOptions extends AxiosRequestConfig {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export async function apiClient<T>(
  url: string,
  options: ApiOptions = {}
): Promise<T | number | undefined> {
  try {
    const response: AxiosResponse<T> = await axios({
      method: options.method || "GET",
      url,
      ...options,
    });
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`Error with request to ${url}:`, err.message);
      return err.response?.status;
    } else {
      console.error(`Unexpected error with request to ${url}:`, err);
    }
  }
}
