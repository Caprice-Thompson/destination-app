import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { fetchCountryData } from "../src/destination_data/country";
import { Country } from "../src/types";

describe("Country Data API", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    jest.clearAllMocks();
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
    jest.restoreAllMocks();
  });

  it("should return country data for a valid location", async () => {
    const location = "Spain";
    const mockResponse: Country[] = [
      {
        name: { common: "Spain" },
        capitalCity: ["Madrid"],
        currencies: { EUR: { name: "Euro", symbol: "€" } },
        flag: "🇪🇸", // get url
        languages: { name: "Spanish" },
      },
    ];
    mock
      .onGet(`https://restcountries.com/v3.1/name/${location}`)
      .reply(200, mockResponse);

    const data = await fetchCountryData(location);
    expect(data).toEqual(mockResponse);
  });

  it("should handle errors if the API call fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const location = "NonExistentCountry";

    mock.onGet(`https://restcountries.com/v3.1/name/${location}`).reply(404);

    const data = await fetchCountryData(location);

    expect(data?.status).toBe(404);
  });
});
