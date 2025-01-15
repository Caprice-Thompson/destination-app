import { getCountryServiceHandler } from "../../src/handlers/country-service-handler";
import { APIGatewayEvent } from "aws-lambda";

const mockCountryService = {
  getCityPopulation: jest.fn(),
  getCountryDetails: jest.fn(),
};
const mockContext = {} as any;
jest.mock("../../src/services/CountryService", () => ({
  CountryService: jest.fn().mockImplementation(() => mockCountryService),
}));

describe("Country Service Lambda handler", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    mockCountryService.getCityPopulation.mockResolvedValueOnce(1000000);
    mockCountryService.getCountryDetails.mockResolvedValueOnce({
      name: "Japan",
    });
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
            cityPopulation: 1000000,
            countryDetails: { name: "Japan" },
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
