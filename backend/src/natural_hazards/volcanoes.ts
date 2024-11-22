import { apiClient } from "../api/apiClient";
import { Volcano } from "../types";

import dotenv from "dotenv";

dotenv.config();
//API Endpoint
export const getVolcanoList = async (): Promise<Volcano[]> => {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const VOLCANO_ENDPOINT = process.env.VOLCANO_ENDPOINT;

  const uniqueVolcanoNames = new Set<string>();
  const allVolcanoes: Volcano[] = [];

  try {
    const firstResponse = await apiClient<any>(
      `${VOLCANO_ENDPOINT}?page=1`,
      options
    );

    if (!firstResponse || !firstResponse.totalPages) {
      console.error("No valid response from the API or totalPages not found.");
      return [];
    }

    for (let page = 1; page <= firstResponse.totalPages; page++) {
      const response = await apiClient<any>(
        `${VOLCANO_ENDPOINT}?page=${page}`,
        options
      );

      if (response && response.items) {
        response.items.forEach((item: any) => {
          if (!uniqueVolcanoNames.has(item.name)) {
            uniqueVolcanoNames.add(item.name);
            allVolcanoes.push({
              name: item.name,
              region: item.location,
              country: item.country,
            });
          }
        });
      }
    }

    return allVolcanoes;
  } catch (error) {
    console.error("Error fetching volcano data:", error);
    return [];
  }
};

export const getVolcanoByCountry = async (country: string): Promise<Volcano[]> => {
  const volcanoList = await getVolcanoList();
  return volcanoList.filter((volcano) => volcano.country === country);
};
