import { getData } from "../src/api/client";
import { Volcano, VolcanoService } from "../src/services/VolcanoService";

jest.mock("../src/api/client");

describe("Volcano Service", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      VOLCANO_ENDPOINT: "https://mocked-volcano-api.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("Volcano Data", () => {
    it("should return a unique list of volcanoes across multiple pages", async () => {
      const mockResponsePage1 = {
        totalPages: 2,
        items: [
          { name: "Mount Fuji", region: "Honshu", country: "Japan" },
          { name: "Mount Etna", region: "Sicily", country: "Italy" },
        ],
      };

      const mockResponsePage2 = {
        totalPages: 2,
        items: [
          { name: "Kilauea", region: "Hawaii", country: "USA" },
          { name: "Mount Etna", region: "Sicily", country: "Italy" },
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
    });
    it("should handle API errors and log an error message", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      (getData as jest.Mock).mockRejectedValue(new Error("API Error"));

      const volcanoService = new VolcanoService();
      const volcanoList = await volcanoService.getVolcanoList();

      expect(volcanoList).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error fetching volcano list:",
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
    it("should throw an error if the API endpoint is missing", () => {
      process.env.VOLCANO_ENDPOINT = "";

      expect(() => new VolcanoService()).toThrow(
        "Volcano API endpoint is not set in environment variables."
      );
    });
    describe("getVolcanoByCountry", () => {
      it("should return volcanoes filtered by country", async () => {
        const mockResponse = {
          totalPages: 1,
          items: [
            { name: "Mount Fuji", region: "Honshu", country: "Japan" },
            { name: "Mount Etna", region: "Sicily", country: "Italy" },
            { name: "Kilauea", region: "Hawaii", country: "USA" },
          ],
        };

        (getData as jest.Mock).mockResolvedValue(mockResponse);

        const volcanoService = new VolcanoService();
        const volcanoesInJapan = await volcanoService.getVolcanoByCountry(
          "Japan"
        );

        expect(volcanoesInJapan).toEqual([
          { name: "Mount Fuji", region: "Honshu", country: "Japan" },
        ]);
      });

      it("should return an empty array if no volcanoes match the country", async () => {
        const mockResponse = {
          totalPages: 1,
          items: [
            { name: "Mount Fuji", region: "Honshu", country: "Japan" },
            { name: "Mount Etna", region: "Sicily", country: "Italy" },
          ],
        };

        (getData as jest.Mock).mockResolvedValue(mockResponse);

        const volcanoService = new VolcanoService();
        const volcanoesInUSA = await volcanoService.getVolcanoByCountry("USA");

        expect(volcanoesInUSA).toEqual([]);
      });
    });
  });
});
