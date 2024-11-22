import { getVolcanoList } from "../src/natural_hazards/volcanoes";
import { Volcano } from "../src/types";
import { apiClient } from "../src/api/apiClient";

jest.mock("../src/api/apiClient");

describe("Volcano", () => {
  it("should return successful volcano data", async () => {
    const mockedApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

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

    mockedApiClient.mockImplementation((url: string) => {
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
    expect(mockedApiClient).toHaveBeenCalledTimes(3);
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.stringContaining("page=1"),
      expect.any(Object)
    );
    expect(mockedApiClient).toHaveBeenCalledWith(
      expect.stringContaining("page=2"),
      expect.any(Object)
    );
  });
});
