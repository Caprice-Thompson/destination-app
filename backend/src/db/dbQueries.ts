import db from "./db";
import { CityPopulation } from "../services/CountryService";
import { ThingsToDo, UNESCOSite } from "../services/TourismService";

export const getThingsToDo = async (country: string): Promise<ThingsToDo[]> => {
  return db.any(`SELECT * FROM things_to_do where location = '${country}'`);
};

export const getPopulation = async (
  country: string
): Promise<CityPopulation[]> => {
  return db.any(`SELECT * FROM population where country = '${country}'`);
};

export const getUNESCOSites = async (
  country: string
): Promise<UNESCOSite[]> => {
  return db.any(`SELECT * FROM unesco_sites where country = '${country}'`);
};
