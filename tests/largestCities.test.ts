import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fs from "fs";
import { scrapeDataWithRateLimits } from "../src/destination_data/web_data/utils/scrapeData";
import { scrapeDataForLargestCities } from "../src/destination_data/web_data/largestCities";
import { URLSForLargestCities } from "../src/destination_data/web_data/utils/constants";
import { mockLargestCitiesHtml } from "./mock_data/fixtures";
import { Population } from "../src/types";

jest.mock("fs");

describe("scrapeDataWithRateLimit", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  it("fetches data and writes to JSON file successfully", async () => {
    mock
      .onGet("https://en.wikipedia.org/wiki/List_of_largest_cities")
      .reply(200, mockLargestCitiesHtml);

    await scrapeDataWithRateLimits(
      URLSForLargestCities,
      scrapeDataForLargestCities
    );

    const expectedData: Population[] = [
      {
        city: "Tokyo",
        country: "Japan",
        population: "13,515,271",
      },
      {
        city: "Delhi",
        country: "India",
        population: "16,753,235",
      },
    ];

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "cities_List_of_largest_cities.json",
      JSON.stringify(expectedData, null, 2)
    );
  });
});
