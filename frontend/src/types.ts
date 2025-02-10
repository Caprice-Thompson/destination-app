export type CityPopulation = {
    city: string;
    country: string;
    population: string;
}

export type LanguageDetail = {
    name: string;
};

export type ThingsToDo = {
    location: string;
    item: string[];
}

export type UNESCOSite = {
    site: string;
    area: string;
    country: string;
    description: string;
}

export type Volcano = {
    name: string;
    region: string;
    country: string;
};

export type Earthquake = {
    name: string;
    magnitude: number;
    date: string;
    type: string;
    tsunami: number;
};