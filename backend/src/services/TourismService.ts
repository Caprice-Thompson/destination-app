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
}

// Domain
export class Tourism {
  constructor(private readonly tourismRepo: TourismInterface) { }

  async getTourismData(country: string): Promise<TourismData> {
    const thingsToDoList = await this.tourismRepo.getThingsToDo(country);
    const unescoSitesList = await this.tourismRepo.getUNESCOSites(country);
    return { thingsToDoList, unescoSitesList };
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
}

// Infrastructure

export class TourismDatabaseRepository implements TourismInterface {
  async getThingsToDo(country: string): Promise<ThingsToDo[]> {
    return db.any(`SELECT * FROM things_to_do WHERE location = $1`, [country]);
  }

  async getUNESCOSites(country: string): Promise<UNESCOSite[]> {
    return db.any(`SELECT * FROM unesco_sites WHERE country = $1`, [country]);
  }
}
