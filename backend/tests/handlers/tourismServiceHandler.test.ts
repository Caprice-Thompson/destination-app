import { APIGatewayEvent } from "aws-lambda";
import { getTourismServiceHandler } from "../../src/handlers/tourism-service-handler";
import { AppError } from "../../src/utils/errorHandler";

jest.mock("../../src/services/TourismService", () => ({
  TourismDatabaseRepository: jest.fn().mockImplementation(() => ({
    getThingsToDo: jest.fn().mockResolvedValue({ name: "Japan" }),
    getUNESCOSites: jest.fn().mockResolvedValue({ name: "Japan" }),
  })),
  Tourism: jest.fn(),
  TourismApplicationService: jest.fn().mockImplementation(() => ({
    getTourismData: jest.fn().mockImplementation((country) => {
      if (!country) {
        throw new AppError(400, "Country parameter is required");
      }
      return Promise.resolve({
        thingsToDo: { name: "Japan" },
        unescoSites: { name: "Japan" },
      });
    }),
  })),
}));

const mockContext = {} as any;

describe("Tourism Service Lambda handler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should execute successfully and return status code 200", async () => {
    const mockEvent: APIGatewayEvent = {
      httpMethod: "GET",
      path: "/api/getTourismTestData",
      queryStringParameters: { country: "Japan" },
      headers: {},
      body: null,
      isBase64Encoded: false,
    } as any;

    const response = await getTourismServiceHandler(mockEvent, mockContext);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      JSON.stringify(
        {
          message: "Tourism service executed successfully!",
          data: {
            thingsToDo: {
              name: "Japan",
            },
            unescoSites: {
              name: "Japan",
            },
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
        path: "/api/getTourismTestData",
        queryStringParameters: null,
        headers: {},
        body: null,
        isBase64Encoded: false,
      } as any;

      const response = await getTourismServiceHandler(mockEvent, mockContext);

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body)).toEqual({
        message: "Country parameter is required",
      });
    });
    it("should return 500 status code when event is invalid", async () => {
      const mockEvent = null as any;

      const response = await getTourismServiceHandler(mockEvent, mockContext);

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toEqual({
        message: "Internal server error",
      });
    });
  });
});
