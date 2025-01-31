import { CountryRepo } from "./services/CountryService";

async function main() {
  const countryService = new CountryRepo("Japan");
  const countryDetails = await countryService.getCountryDetails();
}

main();
