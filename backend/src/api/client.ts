import { AppError } from "../utils/errorHandler";
type RequestOptions = {
  method?: string;
  headers?: Record<string, string>;
  body?: string | URLSearchParams;
  mode?: string;
};

const headers: Record<string, string> = {
  // "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
  // "Access-Control-Allow-Headers": "Content-Type, Apigw-Requestid",
  // "Access-Control-Allow-Origin": "https://d1c44nd79uod1i.cloudfront.net",
  "Content-Type": "application/json",
};

//Cross-Origin Resource Sharing (CORS)
export async function getData<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const defaultOptions: RequestOptions = {
    method: "GET",
    headers: {
      ...headers,
      ...(options?.headers || {})
    },
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
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(500, error.message);
    } else {
      throw new AppError(500, "Unexpected error occurred");
    }
  }
}
