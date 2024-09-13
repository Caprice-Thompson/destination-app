import { fetchWeatherData } from "./climate_features/weather";

const world = 'world';

export function hello(who: string = world): string {
  return `Hello ${who}! `;
}
fetchWeatherData();