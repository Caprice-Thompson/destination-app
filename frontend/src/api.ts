
const BASE_URL = "http://localhost:8080/api";

export interface CountryData {
    name: string;
    population: number;
    gdp: number;
}

export interface TourismData {
    country: string;
    visitors: number;
    attractions: string[];
}

export const fetchCountryData = async (countryName: string, selectedMonth: string): Promise<CountryData> => {
    try {
        const response = await fetch(`${BASE_URL}/getCountryData?country=${encodeURIComponent(countryName)}&month=${encodeURIComponent(selectedMonth)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch country data');

        return await response.json();
    } catch (error) {
        console.error('Error fetching country data:', error);
        throw error;
    }
};

export const fetchTourismData = async (countryName: string): Promise<TourismData> => {
    try {
        const response = await fetch(`${BASE_URL}/getTourismData?country=${encodeURIComponent(countryName)}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Failed to fetch tourism data');

        return await response.json();
    } catch (error) {
        console.error('Error fetching tourism data:', error);
        throw error;
    }
};

//app layer usecase 
export interface CombinedData {
    countryData: CountryData;
    tourismData: TourismData;
}

export const getCountryAndTourismData = async (countryName: string, selectedMonth: string): Promise<CombinedData> => {
    try {
        const [countryData, tourismData] = await Promise.all([
            fetchCountryData(countryName, selectedMonth),
            fetchTourismData(countryName),
        ]);

        return { countryData, tourismData };
    } catch (error) {
        throw new Error("Error fetching data: " + (error as Error).message);
    }
};