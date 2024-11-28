import { getData } from "../api/client";

export type Volcano = {
  name: string;
  region: string;
  country: string;
};

export type VolcanoApiResponse = {
  items: Volcano[];
  totalPages?: number;
  currentPage?: number;
};

export async function getVolcanoList(): Promise<Volcano[]> {
  const volcanoUrl = process.env.VOLCANO_ENDPOINT;

  if (!volcanoUrl) {
    console.error("Environment variable is not set.");
    return [];
  }

  try {
    const firstPageData = await getVolcanoPage(volcanoUrl, 1);
    if (!firstPageData) {
      console.error("No valid response from the API for page 1.");
      return [];
    }

    const totalPages = firstPageData.totalPages || 1;
    const allPagesData = await getAllVolcanoPages(volcanoUrl, totalPages);

    const uniqueVolcanoes = extractUniqueVolcanoes(allPagesData);

    return uniqueVolcanoes;
  } catch (error) {
    console.error("Error fetching volcano list:", error);
    return [];
  }
}

export async function getVolcanoPage(
  endpoint: string,
  page: number
): Promise<VolcanoApiResponse> {
  const options = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };

  const response = await getData<VolcanoApiResponse>(
    `${endpoint}?page=${page}`,
    options
  );
  if (!response) {
    throw new Error("No response received from volcano API");
  }
  return response;
}

async function getAllVolcanoPages(
  endpoint: string,
  totalPages: number
): Promise<VolcanoApiResponse[]> {
  const fetchPromises: Promise<VolcanoApiResponse | null>[] = [];

  for (let page = 1; page <= totalPages; page++) {
    fetchPromises.push(getVolcanoPage(endpoint, page));
  }

  const pagesData = await Promise.all(fetchPromises);
  return pagesData.filter((page): page is VolcanoApiResponse => page !== null);
}

function extractUniqueVolcanoes(pagesData: VolcanoApiResponse[]): Volcano[] {
  const uniqueVolcanoNames = new Set<string>();
  const uniqueVolcanoes: Volcano[] = [];

  pagesData.forEach((page) => {
    page.items.forEach((item: any) => {
      if (item.name && !uniqueVolcanoNames.has(item.name)) {
        uniqueVolcanoNames.add(item.name);
        uniqueVolcanoes.push({
          name: item.name,
          region: item.location,
          country: item.country,
        });
      }
    });
  });

  return uniqueVolcanoes;
}

export async function getVolcanoByCountry(country: string): Promise<Volcano[]> {
  const volcanoList = await getVolcanoList();
  return volcanoList.filter((volcano) => volcano.country === country);
}
