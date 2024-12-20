import { getThingsToDo, getUNESCOSites } from "./dbQueries";

export interface UNESCOSites {
  site: string;
  area: string;
  country: string;
  description: string;
}
export interface ThingsToDo {
  location: string;
  item: string[];
}

interface TourismServiceInterface {
  thingsToDoList: (country: string) => Promise<ThingsToDo[]>;
  getUNESCOSitesList: (country: string) => Promise<UNESCOSites[]>;
}

export class TourismService implements TourismServiceInterface {
  public country: string;

  constructor(country: string) {
    this.country = country;
  }

  async thingsToDoList(): Promise<ThingsToDo[]> {
    const thingsToDoList = getThingsToDo(this.country);
    return thingsToDoList;
  }

  async getUNESCOSitesList(): Promise<UNESCOSites[]> {
    const unescoSitesList = getUNESCOSites(this.country);
    return unescoSitesList;
  }
}
