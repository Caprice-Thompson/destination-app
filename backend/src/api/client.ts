import { AppError } from "../utils/errorHandler";

type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | URLSearchParams;
};

export async function getData<T>(
  url: string,
  options?: RequestOptions
): Promise<T | void> {
  const defaultOptions: RequestOptions = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  };
  try {
    const response = await fetch(url, defaultOptions);
    if (!response.ok) {
      throw new AppError(
        response.status,
        `HTTP error! Status: ${response.status}: ${JSON.stringify(
          response.body
        )}`
      );
    }
    const data: T = await response.json();
    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(500, error.message);
    } else {
      throw new AppError(500, 'Unexpected error occurred');
    }
  }
}
