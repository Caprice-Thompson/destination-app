import {
    Country,
    ThingsToDo,
    Population,
    WorldHeritageSiteData,
    Service,
} from "../types";

export interface CountryServiceResult {
    countryDetails: Country;
    thingsToDo: ThingsToDo[];
    population: Population[];
    worldHeritageSites: WorldHeritageSiteData[];
}

interface CountryService {
    getCountryService: () => Promise<CountryServiceResult>;
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
            const [countryDetails, thingsToDo, population, worldHeritageSites] =
                await Promise.all([
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

// export async function CountryService(location: string): Promise<CountryService> {
//     return {
//         getCountryService: async () => {
//             const countryDetails = await getCountryDetails(location);
//             if (!countryDetails) {
//                 throw new Error("Country details not found.");
//             }
//             return {
//                 countryDetails,
//                 thingsToDo: await getThingsToDo(location),
//                 population: await getPopulation(location),
//                 worldHeritageSites: await getWorldHeritageSites(location),
//             };
//         },
//     };
// }
