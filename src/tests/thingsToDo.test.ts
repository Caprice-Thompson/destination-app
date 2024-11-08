import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { mockThingsToDoHtml } from "./mock_data/fixtures";
import { scrapeDataWithRateLimits } from "../web/scrapeData";
import { getThingsToDoData } from "../web/thingsToDo";
import { ThingsToDo } from "../types";

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
    const URL_BUCKET_LIST = process.env.URL_BUCKET_LIST || "";
    const data = await scrapeDataWithRateLimits(
      URL_BUCKET_LIST,
      getThingsToDoData
    );

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

    expect(data).toEqual(expectedData);
  });
});
