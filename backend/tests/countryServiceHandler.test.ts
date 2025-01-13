import { getCountryServiceHandler } from "../src/handlers/country-service-handler";
import { APIGatewayEvent } from "aws-lambda";
import { AppError } from "../src/utils/errorHandler";

const mockCountryService = {
    getCityPopulation: jest.fn(),
    getCountryDetails: jest.fn()
};

jest.mock("../src/services/CountryService", () => ({
    CountryService: jest.fn().mockImplementation(() => mockCountryService)
}));

describe("Country Service Lambda handler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockCountryService.getCityPopulation.mockResolvedValueOnce(1000000);
        mockCountryService.getCountryDetails.mockResolvedValueOnce({ name: "Japan" });
    });

    it("should execute successfully and return status code 201", async () => {
        const mockContext = {} as any;

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
        expect(response.body).toBeDefined();
        expect(response.body).toEqual(JSON.stringify({
            message: "Country service executed successfully!",
            data: {
                cityPopulation: 1000000,
                countryDetails: { name: "Japan" }
            }
        }, null, 2));

    });

    it("should return status code 500 on error", async () => {
        const mockError = new AppError(500, "Some internal error");
        mockCountryService.getCityPopulation.mockRejectedValueOnce(mockError);
        mockCountryService.getCountryDetails.mockRejectedValueOnce(mockError);

        const mockContext = {} as any;

        const mockEvent: APIGatewayEvent = {
            httpMethod: "GET",
            path: "/api/getCountryTestData",
            queryStringParameters: {},
            headers: {},
            body: null,
            isBase64Encoded: false,
        } as any;

        const response = await getCountryServiceHandler(mockEvent, mockContext);
        expect(response.statusCode).toBe(500);

        expect(response).toEqual(JSON.stringify({
            message: "Internal server error",
            error: mockError.message
        }, null, 2));
    });

});
