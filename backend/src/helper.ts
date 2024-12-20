import { CountryService } from "./country/CountryService";
import { TourismService } from "./country/TourismService";
import {
  EarthquakeDataParams,
  launchEarthquakeService,
} from "./natural_hazards/EarthquakeService";
import { VolcanoService } from "./natural_hazards/VolcanoService";
import {
  Coordinates,
  getGeoCoordinates,
} from "./natural_hazards/getGeoCoordinates";

export const getEQParams = (coordinates: Coordinates): EarthquakeDataParams => {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  currentDate.setFullYear(currentDate.getFullYear() - 20);
  const formattedStartDate = currentDate.toISOString().split("T")[0];
  const params = {
    longitude: coordinates?.longt,
    latitude: coordinates?.latt,
    startTime: formattedStartDate,
    endTime: formattedDate,
    maxRadius: 5,
    limit: 10,
    format: "geojson",
  };
  return params;
};

export const getNaturalHazardData = async (country: string, month: number) => {
  const coordinates = await getGeoCoordinates(country);
  const params = getEQParams(coordinates!);

  const volcanoService = new VolcanoService();
  const volcanoesByCountry = await volcanoService.getVolcanoByCountry(country);

  const earthquakeApiUrl = process.env.EQ_BASE_URL ?? "";
  const earthquakeService = launchEarthquakeService(earthquakeApiUrl, params);
  const earthquakeData = await earthquakeService.getEarthquakeData();
  const eqAverages = earthquakeService.calculateEarthquakeStatistics(
    earthquakeData,
    month
  );

  return { volcanoesByCountry, earthquakeData, eqAverages };
};

export const getCountryAndTourismData = async (country: string) => {
  const countryService = new CountryService(country);
  const [countryDetails, cityPopulation] = await Promise.all([
    countryService.getCountryDetails(),
    countryService.getCityPopulation(),
  ]);

  const tourismService = new TourismService(country);
  const [thingsToDo, unescoList] = await Promise.all([
    tourismService.thingsToDoList(),
    tourismService.getUNESCOSitesList(),
  ]);

  return { countryDetails, cityPopulation, thingsToDo, unescoList };
};
