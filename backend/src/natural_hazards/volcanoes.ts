import { apiClient } from "../api/apiClient";
import { Volcano } from "../types";

export async function getVolcanoList(): Promise<Volcano[]> {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const VOLCANO_ENDPOINT = process.env.VOLCANO_ENDPOINT;

  if (!VOLCANO_ENDPOINT) {
    console.error("Environment variable VOLCANO_ENDPOINT is not set.");
    return [];
  }

  const uniqueVolcanoNames = new Set<string>();
  const allVolcanoes: Volcano[] = [];

  try {
    const firstResponse = await apiClient<any>(
      `${VOLCANO_ENDPOINT}?page=1`,
      options
    );

    if (!firstResponse || !firstResponse.totalPages) {
      console.error("No valid response from the API or no pages found.");
      return [];
    }

    // Process the first page
    if (firstResponse.items) {
      firstResponse.items.forEach((item: any) => {
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

    // Process additional pages
    const totalPages = firstResponse.totalPages;
    for (let page = 2; page <= totalPages; page++) {
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
  } catch (error) {
    console.error("Error fetching volcano list:", error);
  }

  return allVolcanoes;
}

export async function getVolcanoByCountry(country: string): Promise<Volcano[]> {
  const volcanoList = await getVolcanoList();
  return volcanoList.filter((volcano) => volcano.country === country);
}

