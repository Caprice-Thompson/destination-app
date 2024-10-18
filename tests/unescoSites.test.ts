import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fs from "fs";
import { mockWorldHeritageSitesHtml } from "./mock_data/fixtures";
import { scrapeDataWithRateLimits } from "../src/web/scrapeData";
import { getWorldHeritageSites } from "../src/web/web_data/unescoSites";
import { WorldHeritageSiteData } from "../src/types";

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

  const url = [
    "https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_Africa",
  ];

  it("fetches data and writes to JSON file successfully", async () => {
    mock.onGet(url[0]).reply(200, mockWorldHeritageSitesHtml);

    await scrapeDataWithRateLimits(url, getWorldHeritageSites);

    const expectedData: WorldHeritageSiteData[] = [
      {
        site: "Aapravasi Ghat",
        location: "Mauritius",
        description:
          "After the British abolished slavery in Mauritius, the Aapravasi Ghat was chosen by the British government to receive Indian indentured laborers into the country to work on farms and sugar estates. Between 1834 and 1920, almost half a million contracted workers passed through Port Louis from India, either to work in Mauritius or to transfer to other British colonies.",
      },
    ];

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "world_heritage_sites.json",
      JSON.stringify(expectedData, null, 2)
    );
  });
});
