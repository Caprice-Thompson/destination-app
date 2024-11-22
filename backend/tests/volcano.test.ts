import { getVolcanoList } from "../src/natural_hazards/volcanoes";
import { Volcano } from "../src/types";
import { apiClient } from "../src/api/apiClient";

jest.mock("../src/api/apiClient");

describe("Volcano List Fetching", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      VOLCANO_ENDPOINT: "https://mocked-volcano-api.com",
    };
  });

  afterAll(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  it("should return successful volcano data", async () => {
    const mockResponsePage1 = {
      totalPages: 2,
      items: [
        { name: "Mount Fuji", location: "Honshu", country: "Japan" },
        { name: "Mount Etna", location: "Sicily", country: "Italy" },
      ],
    };

    const mockResponsePage2 = {
      totalPages: 2,
      items: [
        { name: "Kilauea", location: "Hawaii", country: "USA" },
        { name: "Mount Etna", location: "Sicily", country: "Italy" },
      ],
    };

    (apiClient as jest.Mock).mockImplementation((url: string) => {
      if (url.includes("page=1")) {
        return Promise.resolve(mockResponsePage1);
      } else if (url.includes("page=2")) {
        return Promise.resolve(mockResponsePage2);
      }
      return Promise.resolve({ totalPages: 0, items: [] });
    });

    const expectedVolcanoes: Volcano[] = [
      { name: "Mount Fuji", region: "Honshu", country: "Japan" },
      { name: "Mount Etna", region: "Sicily", country: "Italy" },
      { name: "Kilauea", region: "Hawaii", country: "USA" },
    ];

    const volcanoList = await getVolcanoList();

    expect(volcanoList).toEqual(expectedVolcanoes);
    expect(apiClient).toHaveBeenCalledTimes(2); // Two pages fetched
    expect(apiClient).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=1",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    expect(apiClient).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=2",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  });

  it("should handle no volcano data gracefully", async () => {
    (apiClient as jest.Mock).mockResolvedValueOnce({
      totalPages: 0,
      items: [],
    });
    jest.spyOn(console, "error").mockImplementation(() => { });
    const volcanoList = await getVolcanoList();

    expect(volcanoList).toEqual([]);
    expect(apiClient).toHaveBeenCalledTimes(1);
    expect(apiClient).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=1",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  });

  it("should handle API errors gracefully", async () => {
    (apiClient as jest.Mock).mockRejectedValueOnce(new Error("API error"));

    const volcanoList = await getVolcanoList();

    expect(volcanoList).toEqual([]);
    expect(apiClient).toHaveBeenCalledTimes(1);
    expect(apiClient).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=1",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  });
});
