import { getCountryServiceHandler } from "../../src/handlers/country-service-handler";
import { APIGatewayEvent } from "aws-lambda";

const mockCountryRepo = {
  getCityPopulation: jest.fn(),
  getCountryDetails: jest.fn(),
};
const mockContext = {} as any;
jest.mock("../../src/services/CountryService", () => ({
  CountryRepo: jest.fn().mockImplementation(() => mockCountryRepo),
  CountryDomain: jest.fn().mockImplementation(() => ({
    getCountryData: jest.fn().mockImplementation(async () => {
      const countryDetails = await mockCountryRepo.getCountryDetails();
      const cityPopulations = await mockCountryRepo.getCityPopulation();
      return {
        countryDetails,
        cityPopulations,
      };
    }),
  })),
}));

describe("Country Service Lambda handler", () => {
  const originalEnv = process.env;
  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...originalEnv,
      COUNTRY_BASE_URL: "https://mock-country-service.com",
    };

    const countryDetails = {
      name: "Japan",
      capitalCity: ["Tokyo"],
      languages: [{ name: "Japanese" }],
      currencies: {
        JPY: { name: "Japanese yen", symbol: "¥" }
      },
      flag: "https://example.com/japan-flag.svg"
    };

    const cityPopulations = [{
      city: "Tokyo",
      country: "Japan",
      population: "37400068"
    }];

    mockCountryRepo.getCountryDetails.mockResolvedValue(countryDetails);
    mockCountryRepo.getCityPopulation.mockResolvedValue(cityPopulations);
  });

  it("should execute successfully and return status code 200", async () => {

    const mockEvent: APIGatewayEvent = {
      httpMethod: "GET",
      path: "/api/getCountryTestData",
      queryStringParameters: { country: "Japan" },
      headers: {},
      body: null,
      isBase64Encoded: false,
    } as any;

    const response = await getCountryServiceHandler(mockEvent, mockContext);


    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      JSON.stringify(
        {
          message: "Country service executed successfully!",
          data: {
            countryDetails: {
              name: "Japan",
              capitalCity: ["Tokyo"],
              languages: [{ name: "Japanese" }],
              currencies: {
                JPY: { name: "Japanese yen", symbol: "¥" }
              },
              flag: "https://example.com/japan-flag.svg"
            },
            cityPopulations: [{
              city: "Tokyo",
              country: "Japan",
              population: "37400068"
            }]
          },
        },
        null,
        2
      )
    );
  });

  describe("Error Handling", () => {
    it("should return 400 when country parameter is missing", async () => {
      const mockEvent: APIGatewayEvent = {
        httpMethod: "GET",
        path: "/api/getCountryTestData",
        queryStringParameters: null,
        headers: {},
        body: null,
        isBase64Encoded: false,
      } as any;

      const response = await getCountryServiceHandler(mockEvent, mockContext);

      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual(
        JSON.stringify({
          message: "Country parameter is required",
        })
      );
    });
    it("should return 500 status code when event is invalid", async () => {
      const mockEvent = null as any;

      const response = await getCountryServiceHandler(mockEvent, mockContext);

      expect(response.statusCode).toBe(500);
      expect(response.body).toEqual(
        JSON.stringify({
          message: "Internal server error"
        })
      );
    });
  });
});
