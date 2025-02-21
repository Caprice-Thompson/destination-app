import { APIGatewayEvent, Context } from 'aws-lambda';
import { getAvailableCountriesHandler } from '../../src/handlers/get-available-countries-handler';
import { AppError } from '../../src/utils/errorHandler';

jest.mock('../../src/services/TourismService', () => {
    const mockGetAvailableCountries = jest.fn();
    return {
        TourismDatabaseRepository: jest.fn(),
        TourismApplicationService: jest.fn().mockImplementation(() => ({
            getAvailableCountries: mockGetAvailableCountries
        })),
        mockGetAvailableCountries
    };
});

describe('getAvailableCountriesHandler', () => {
    let mockEvent: APIGatewayEvent;
    let mockContext: Context;
    let mockGetAvailableCountries: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
        mockEvent = {} as APIGatewayEvent;
        mockContext = {} as Context;
        mockGetAvailableCountries = jest.requireMock('../../src/services/TourismService').mockGetAvailableCountries;
    });

    it('should return available countries successfully', async () => {
        const mockCountries = ['France', 'Italy', 'Spain'];
        mockGetAvailableCountries.mockResolvedValue(mockCountries);

        const response = await getAvailableCountriesHandler(mockEvent, mockContext);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Available countries retrieved successfully!',
            data: mockCountries
        });
    });

    it('should handle AppError correctly', async () => {
        const mockError = new AppError(400, 'Test error', 'Test detail');
        mockGetAvailableCountries.mockRejectedValue(mockError);

        const response = await getAvailableCountriesHandler(mockEvent, mockContext);

        expect(response.statusCode).toBe(400);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Test error',
            detail: 'Test detail'
        });
    });

    it('should handle unexpected errors correctly', async () => {
        const mockError = new Error('Unexpected error');
        mockGetAvailableCountries.mockRejectedValue(mockError);

        const response = await getAvailableCountriesHandler(mockEvent, mockContext);

        expect(response.statusCode).toBe(500);
        expect(JSON.parse(response.body)).toEqual({
            message: 'Internal server error'
        });
    });
});
