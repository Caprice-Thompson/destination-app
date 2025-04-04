import { Earthquake, ThingsToDo, UNESCOSite, Volcano, EarthquakeStatistics } from "./types";
import { apiConfig } from "./config/api.config";

const { endpoints } = apiConfig;
export interface CountryData {
  name: string;
  capitalCity: string[];
  languages: { name: string }[];
  currencies: { [key: string]: { name: string; symbol: string } };
  flag: string;
}

export type CountryResponse = {
  name: { common: string };
  capital: string[];
  languages: Record<string, string>;
  currencies: { [key: string]: { name: string; symbol: string } };
  flags: { svg: string };
};

export interface TourismData {
  thingsToDoList: ThingsToDo[];
  unescoSitesList: UNESCOSite[];
}

export interface VolcanoData {
  volcanoesByCountry: Volcano[];
}

export interface EarthquakeData {
  earthquakeData: Earthquake[];
  earthquakeStatistics: EarthquakeStatistics;
}

export const headers = {
  "Access-Control-Allow-Headers": "Content-Type",
};

export const fetchCountryData = async (
  countryName: string
): Promise<CountryData> => {
  try {
    const response = await fetch(
      `${endpoints.country}/getCountryData?country=${encodeURIComponent(
        countryName
      )}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch country data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching country data:", error);
    throw error;
  }
};

export const fetchTourismData = async (
  countryName: string
): Promise<TourismData> => {
  try {
    const response = await fetch(
      `${endpoints.tourism}/getTourismData?country=${encodeURIComponent(
        countryName
      )}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch tourism data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching tourism data:", error);
    throw error;
  }
};

export const fetchVolcanoData = async (
  countryName: string
): Promise<Volcano> => {
  try {
    const response = await fetch(
      `${endpoints.volcano}/getVolcanoData?country=${encodeURIComponent(
        countryName
      )}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch volcano data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching volcano data:", error);
    throw error;
  }
};

export const fetchEarthquakeData = async (
  countryName: string,
  selectedMonth: string
): Promise<EarthquakeData> => {
  try {
    const response = await fetch(
      `${endpoints.earthquake}/getEarthquakeData?country=${encodeURIComponent(
        countryName
      )}&month=${encodeURIComponent(selectedMonth)}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch earthquake data");

    return await response.json();
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
};

//app layer usecase
export interface CombinedCountryAndTourismData {
  countryData: CountryData;
  tourismData: TourismData;
}

export interface CombinedVolcanoAndEarthquakeData {
  volcanoData: Volcano;
  earthquakeData: EarthquakeData[];
}

export const getCountryAndTourismData = async (
  countryName: string
): Promise<CombinedCountryAndTourismData> => {
  try {
    const [countryData, tourismData] = await Promise.all([
      fetchCountryData(countryName),
      fetchTourismData(countryName),
    ]);

    return { countryData, tourismData };
  } catch (error) {
    throw new Error("Error fetching data: " + (error as Error).message);
  }
};

export const getVolcanoAndEarthquakeData = async (
  countryName: string,
  selectedMonth: string
): Promise<CombinedVolcanoAndEarthquakeData> => {
  try {
    const [volcanoData, earthquakeData] = await Promise.all([
      fetchVolcanoData(countryName),
      fetchEarthquakeData(countryName, selectedMonth),
    ]);

    return { volcanoData, earthquakeData: [earthquakeData] };
  } catch (error) {
    throw new Error("Error fetching data: " + (error as Error).message);
  }
};

export const fetchAvailableCountries = async (): Promise<{ country: string }[]> => {
  try {
    const response = await fetch(
      `${endpoints.tourism}/getAvailableCountries`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) throw new Error("Failed to fetch available countries");

    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching available countries:", error);
    throw error;
  }
};
