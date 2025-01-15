import { APIGatewayEvent } from "aws-lambda";
import { getVolcanoServiceHandler } from "../../src/handlers/volcano-service-handler";

const mockVolcanoService = {
    getVolcanoByCountry: jest.fn(),
};
const mockContext = {} as any;
jest.mock("../../src/services/VolcanoService", () => ({
    VolcanoService: jest.fn().mockImplementation(() => mockVolcanoService),
}));

describe("Volcano Service Lambda handler", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        mockVolcanoService.getVolcanoByCountry.mockResolvedValueOnce({
            name: "Japan",
        });
    });

    it("should execute successfully and return status code 200", async () => {

        const mockEvent: APIGatewayEvent = {
            httpMethod: "GET",
            path: "/api/getVolcanoTestData",
            queryStringParameters: { country: "Japan" },
            headers: {},
            body: null,
            isBase64Encoded: false,
        } as any;

        const response = await getVolcanoServiceHandler(mockEvent, mockContext);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            JSON.stringify(
                {
                    message: "Volcano service executed successfully!",
                    data: {
                        name: "Japan",
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
                path: "/api/getVolcanoTestData",
                queryStringParameters: null,
                headers: {},
                body: null,
                isBase64Encoded: false,
            } as any;

            const response = await getVolcanoServiceHandler(mockEvent, mockContext);

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body)).toEqual({
                message: "Country parameter is required",
            });
        });
        it("should return 500 status code when event is invalid", async () => {
            const mockEvent = null as any;

            const response = await getVolcanoServiceHandler(mockEvent, mockContext);

            expect(response.statusCode).toBe(500);
            expect(JSON.parse(response.body)).toEqual({
                message: "Internal server error"
            });
        });
    });
});
