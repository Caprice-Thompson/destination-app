import { fetchWeatherData } from "../src/climate_features/weather";


describe("Weather Data", () => {

      it("get data when calling weather api", async () => {
            const weatherData = await fetchWeatherData();
            expect(weatherData).toBeDefined();
      });
});
