import { fetchWeatherData } from "./climate_features/weather";
import { scrapeDataWithRateLimit } from "./web-data/largestCities";
import { scrapeDataWithRateLimits } from "./web-data/thingsToDo";
import { scrapeAllData } from "./web-data/unescoSites";

const world = 'world';

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}
//scrapeAllData();
//scrapeDataWithRateLimit();
scrapeDataWithRateLimits();
