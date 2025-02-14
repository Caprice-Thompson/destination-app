import { AppError } from "../utils/errorHandler";
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | URLSearchParams;
  mode?: string;
};

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Max-Age": "3600",
};

//Cross-Origin Resource Sharing (CORS)
export async function getData<T>(
  url: string,
  options?: RequestOptions
): Promise<T | void> {
  const defaultOptions: RequestOptions = {
    method: "GET",
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
    mode: 'cors',
    ...options,
  };
  try {
    const response = await fetch(url, defaultOptions as RequestInit);
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
      throw new AppError(500, "Unexpected error occurred");
    }
  }
}
