import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { Country } from "../src/types";
import { getCountryDetails } from "../src/country/country";

let mock: MockAdapter;
const COUNTRY_ENDPOINT = process.env;

beforeEach(() => {
  jest.clearAllMocks();
  mock = new MockAdapter(axios);
});

afterEach(() => {
  mock.restore();
  jest.restoreAllMocks();
});

describe("Country Data API", () => {
  it("should return country data for a valid location", async () => {
    const location = "Spain";
    const mockResponse: Country[] = [
      {
        name: { common: "Spain" },
        capitalCity: ["Madrid"],
        currencies: { EUR: { name: "Euro", symbol: "€" } },
        flag: "https://flagcdn.com/w320/es.png", 
        languages: { name: "Spanish" },
      },
    ];
    mock.onGet(`${COUNTRY_ENDPOINT}${location}`).reply(200, mockResponse);

    const data = await getCountryDetails(location);
    expect(data).toEqual(mockResponse);
  });
});

describe("Handle errors", () => {
  it("should handle errors if the API call fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const location = "NonExistentCountry";

    mock.onGet(`${COUNTRY_ENDPOINT}${location}`).reply(404);

    const data = await getCountryDetails(location);

    expect(data).toBe(404);
  });
});
