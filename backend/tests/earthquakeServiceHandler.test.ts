import { getCountryServiceHandler } from "../src/handlers/country-service-handler";
import { APIGatewayEvent } from "aws-lambda";
import { getEarthquakeServiceHandler } from "../src/handlers/earthquake-service-handler";
import { EarthquakeStatistics, launchEarthquakeService } from "../src/services/EarthquakeService";
import { getGeoCoordinates } from "../src/utils/getGeoCoordinates";

jest.mock('../src/utils/getGeoCoordinates');
jest.mock('../src/services/EarthquakeService');

describe("Earthquake Service Lambda handler", () => {
    const originalEnv = process.env;
    const mockContext = {} as any;
    const mockEarthquakeStats: EarthquakeStatistics = {
        totalEarthquakes: 4,
        avgEarthquakesInMonth: 0.75,
        avgTsunamiCount: 0.5,
        avgMagnitude: 6.2,
    };
    const mockEarthquakeData = [
        {
            magnitude: 5.2,
            name: "100km SSW of XYZ",
            date: new Date(1625247600000).toISOString(),
            type: "earthquake",
            tsunami: 1,
        },
    ];
    beforeAll(async () => {
        process.env = {
            ...originalEnv,
            EQ_BASE_URL: "https://mock-earthquake-service.com",
        };
    });
    beforeEach(() => {
        jest.clearAllMocks();
        (getGeoCoordinates as jest.Mock).mockResolvedValue({
            latitude: 35.6762,
            longitude: 139.6503
        });
        const mockEarthquakeService = {
            getEarthquakeData: jest.fn().mockResolvedValue(mockEarthquakeData),
            calculateEarthquakeStatistics: jest.fn().mockReturnValue(mockEarthquakeStats)
        };
        (launchEarthquakeService as jest.Mock).mockReturnValue(mockEarthquakeService);
    });


    it("should execute successfully and return status code 200", async () => {

        const mockEvent: APIGatewayEvent = {
            httpMethod: "GET",
            path: "/api/getEarthquakeTestData",
            queryStringParameters: { country: "Japan", month: "1" },
            headers: {},
            body: null,
            isBase64Encoded: false,
        } as any;

        const response = await getEarthquakeServiceHandler(mockEvent, mockContext);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(
            JSON.stringify(
                {
                    message: "Earthquake service executed successfully!",
                    data: {
                        earthquakeData: mockEarthquakeData,
                        eqAverages: mockEarthquakeStats,
                    },
                },
                null,
                2
            )
        );
    });

    describe("Error Handling", () => {
        it("should return 400 when country and month parameter are missing", async () => {
            const mockEvent: APIGatewayEvent = {
                httpMethod: "GET",
                path: "/api/getEarthquakeTestData",
                queryStringParameters: null,
                headers: {},
                body: null,
                isBase64Encoded: false,
            } as any;

            const response = await getEarthquakeServiceHandler(mockEvent, mockContext);

            expect(response.statusCode).toBe(400);
            expect(JSON.parse(response.body)).toEqual({
                message: "Country and month parameters are required."
            });
        });
        it("should return 500 status code when event is invalid", async () => {
            const mockEvent = null as any;

            const response = await getEarthquakeServiceHandler(mockEvent, mockContext);

            expect(response.statusCode).toBe(500);
            expect(JSON.parse(response.body)).toEqual({
                message: "Internal server error"
            });
        });
    });
});
