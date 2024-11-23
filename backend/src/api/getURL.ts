import { EarthquakeDataParams } from "../types";

function buildUrl(
  base: string,
  path: string,
  queryParams: Record<string, string> = {}
): string {
  const fullUrl = new URL(path, base);

  if (Object.keys(queryParams).length > 0) {
    const searchParams = new URLSearchParams(queryParams);
    fullUrl.search = searchParams.toString();
  }

  return fullUrl.toString();
}
// console.log(
//   buildUrl("https://www.example.com", "/en-US/docs", {
//     search: "query",
//     page: "1",
//   })
// );
//build a simple function where i can pass in diff queryparams to build a url
type URLParams = {
  baseURL: string;
  path: string;
  params: string[];
};
interface CustomURLParams<T> {
  getParams(customParams: T): URLSearchParams;
}

const customParamsConverter: CustomURLParams<EarthquakeDataParams> = {
  getParams(params) {
    const stringifiedParams: Record<string, string> = {};
    for (const key in params) {
      const value = params[key as keyof EarthquakeDataParams];

      stringifiedParams[key] = String(value);
    }

    return new URLSearchParams(stringifiedParams);
  },
};

const paramss: EarthquakeDataParams = {
  longitude: "142.369",
  latitude: "-38.142",
  startDate: "2023-01-01",
  endDate: "2023-12-31",
  limit: 10,
};

export function getURL({ baseURL, path, params }: URLParams): string {
  //const params4 = new URLSearchParams({ foo: "1", bar: "2" });
  //https://www.google.co.uk?foo=1&bar=2
  const test = customParamsConverter.getParams(paramss);
  // const test = new URLSearchParams(paramss);
  console.log("ss", test);
  return `${test}`;
}

// a=hello&b=world&c=a&d=2&e=false
//https://www.example.com/en-US/docs?search=query&page=1
