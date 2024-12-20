import { getData } from "../src/api/client";
import { Volcano, VolcanoService } from "../src/natural_hazards/VolcanoService";

jest.mock("../src/api/client");

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

    (getData as jest.Mock).mockImplementation((url: string) => {
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
    const volcanoService = new VolcanoService();
    const volcanoList = await volcanoService.getVolcanoList();

    expect(volcanoList).toEqual(expectedVolcanoes);
    expect(getData).toHaveBeenCalledTimes(3);
    expect(getData).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=1",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    expect(getData).toHaveBeenCalledWith(
      "https://mocked-volcano-api.com?page=2",
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  });
});
