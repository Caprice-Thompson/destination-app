import { Country, ThingsToDo, Population, WorldHeritageSiteData, Service } from "../types";

export interface CountryServiceResult {
    countryDetails: Country;
    thingsToDo: ThingsToDo[];
    population: Population[];
    worldHeritageSites: WorldHeritageSiteData[];
}

export interface CountryServiceDependencies {
    getCountryDetails: (location: string) => Promise<Country>;
    getThingsToDo: (country: string) => Promise<ThingsToDo[]>;
    getPopulation: (country: string) => Promise<Population[]>;
    getWorldHeritageSites: (country: string) => Promise<WorldHeritageSiteData[]>;
}

const CountryService = ({
    getCountryDetails,
    getThingsToDo,
    getPopulation,
    getWorldHeritageSites,
}: CountryServiceDependencies) => {
    const getCountryService = async (
        country: string
    ): Promise<Service<CountryServiceResult>> => {
        try {
            const [
                countryDetails,
                thingsToDo,
                population,
                worldHeritageSites,
            ] = await Promise.all([
                getCountryDetails(country),
                getThingsToDo(country),
                getPopulation(country),
                getWorldHeritageSites(country),
            ]);

            const data: CountryServiceResult = {
                countryDetails,
                thingsToDo,
                population,
                worldHeritageSites,
            };

            return { data };
        } catch (error) {
            console.error("Error in getCountryService:", error);
            throw new Error("Failed to retrieve country service data.");
        }
    };

    return {
        getCountryService,
    };
};

export { CountryService };
