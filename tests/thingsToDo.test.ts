import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import fs from "fs";
import { mockThingsToDoHtml } from "./mock_data/fixtures";
import { URLSForThingsToDo } from "../src/destination_data/web_data/utils/constants";
import { scrapeDataWithRateLimits } from "../src/destination_data/web_data/utils/scrapeData";
import { getThingsToDoData } from "../src/destination_data/web_data/thingsToDo";
import { ThingsToDo } from "../src/types";

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
      .onGet("https://orionrose.weebly.com/bucket-list.html")
      .reply(200, mockThingsToDoHtml);

    await scrapeDataWithRateLimits(URLSForThingsToDo, getThingsToDoData);

    const expectedData: ThingsToDo[] = [
      {
        location: "Louisiana",
        item: ["Celebrate Mardi Gras in New Orleans", "Cruise Caddo Lake SP"],
      },
      {
        location: "Maine",
        item: ["Visit Acadia National Park"],
      },
    ];

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      "things-to-do.json",
      JSON.stringify(expectedData, null, 2)
    );
  });
});
