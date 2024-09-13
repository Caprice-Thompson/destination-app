import axios from "axios";


export const fetchCountryData = async (location: string) => {
    try {
        const apiUrl = `https://restcountries.com/v3.1/name/${location}`;
        const { data } = await axios.get<ApiResponse<Country> | ApiError>(apiUrl);
        return data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
fetchCountryData('Spain');
