import { CountryService } from "./services/CountryService";

async function main() {
    const countryService = new CountryService("Japan");
    const countryDetails = await countryService.getCountryDetails();
}

main();
