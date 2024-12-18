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

export class VolcanoService {
  private volcanoApiEndpoint: string;

  constructor() {
    this.volcanoApiEndpoint = process.env.VOLCANO_ENDPOINT || "";
    if (!this.volcanoApiEndpoint) {
      throw new Error(
        "Volcano API endpoint is not set in environment variables."
      );
    }
  }

  public async getVolcanoList(): Promise<Volcano[]> {
    try {
      const firstPageData = await this.getPage(1);
      if (!firstPageData) {
        throw new Error("No valid response from the API for page 1.");
      }

      const totalPages = firstPageData.totalPages || 1;
      const allPagesData = await this.getAllPages(totalPages);

      return this.getUniqueVolcanoes(allPagesData);
    } catch (error) {
      console.error("Error fetching volcano list:", error);
      return [];
    }
  }

  public async getVolcanoByCountry(country: string): Promise<Volcano[]> {
    const volcanoList = await this.getVolcanoList();
    return volcanoList.filter((volcano) => volcano.country === country);
  }

  private async getPage(page: number): Promise<VolcanoApiResponse> {
    const options = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };

    const response = await getData<VolcanoApiResponse>(
      `${this.volcanoApiEndpoint}?page=${page}`,
      options
    );

    if (!response) {
      throw new Error(`No response received from volcano API for page ${page}`);
    }

    return response;
  }

  private async getAllPages(totalPages: number): Promise<VolcanoApiResponse[]> {
    const fetchPromises = Array.from({ length: totalPages }, (_, i) =>
      this.getPage(i + 1)
    );

    const pagesData = await Promise.all(fetchPromises);
    return pagesData.filter(
      (page): page is VolcanoApiResponse => page !== null
    );
  }

  private getUniqueVolcanoes(pagesData: VolcanoApiResponse[]): Volcano[] {
    const uniqueVolcanoNames = new Set<string>();
    const uniqueVolcanoes: Volcano[] = [];

    pagesData.forEach((page) => {
      page.items.forEach((item) => {
        if (item.name && !uniqueVolcanoNames.has(item.name)) {
          uniqueVolcanoNames.add(item.name);
          uniqueVolcanoes.push({
            name: item.name,
            region: item.region,
            country: item.country,
          });
        }
      });
    });

    return uniqueVolcanoes;
  }
}
