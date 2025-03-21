import db from "../db/db";
import { AppError } from "../utils/errorHandler";

export interface UNESCOSite {
  site: string;
  area: string;
  country: string;
  description: string;
}

export interface ThingsToDo {
  location: string;
  item: string[];
}

export interface TourismData {
  thingsToDoList: ThingsToDo[];
  unescoSitesList: UNESCOSite[];
}

export interface TourismInterface {
  getThingsToDo(country: string): Promise<ThingsToDo[]>;
  getUNESCOSites(country: string): Promise<UNESCOSite[]>;
  getAvailableCountries(): Promise<string[]>;
}

// Domain
export class Tourism {
  constructor(private readonly tourismRepo: TourismInterface) { }

  async getTourismData(country: string): Promise<TourismData> {
    const thingsToDoList = await this.tourismRepo.getThingsToDo(country);
    const unescoSitesList = await this.tourismRepo.getUNESCOSites(country);
    return { thingsToDoList, unescoSitesList };
  }

  async getAvailableCountries(): Promise<string[]> {
    return this.tourismRepo.getAvailableCountries();
  }
}

// Application

export class TourismApplicationService {
  private readonly tourismDomain: Tourism;

  constructor(tourismRepo: TourismInterface) {
    this.tourismDomain = new Tourism(tourismRepo);
  }

  async getTourismData(country: string | undefined): Promise<TourismData> {
    if (!country) {
      throw new AppError(400, "Country parameter is required");
    }

    return this.tourismDomain.getTourismData(country);
  }

  async getAvailableCountries(): Promise<string[]> {
    return this.tourismDomain.getAvailableCountries();
  }
}

// Infrastructure

export class TourismDatabaseRepository implements TourismInterface {
  async getThingsToDo(country: string): Promise<ThingsToDo[]> {
    return db.any(
      `SELECT location, item[1:4] as item 
       FROM things_to_do 
       WHERE location = '${country}';`
    );
  }

  async getUNESCOSites(country: string): Promise<UNESCOSite[]> {
    return db.any(`SELECT * FROM unesco_sites WHERE country = '${country}' LIMIT 4;`);
  }

  async getAvailableCountries(): Promise<string[]> {
    return db.any(
      `SELECT DISTINCT country 
       FROM unesco_sites 
       WHERE country IN (
         SELECT DISTINCT location 
         FROM things_to_do
       )
       ORDER BY country;`
    );
  }
}
