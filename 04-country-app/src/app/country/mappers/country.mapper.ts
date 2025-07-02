import type { Country } from '../interfaces/country.interface';
import type { RESTCountry } from '../interfaces/rest-countries.interface';

export class CountryMapper {
  static mapRestCountryToCountry(restCountry: RESTCountry): Country {
    return {
        cca2: restCountry.cca2,
        flag: restCountry.flag,
        flagSvg: restCountry.flags.svg,
        flagAlt: restCountry.flags.alt,
        name: restCountry.translations['spa'].common ?? 'No Spanish Name',
        capital: restCountry.capital?.join(', '),
        region: restCountry.region,
        subRegion: restCountry.subregion,
        population: restCountry.population,
    };
  }

    static mapRestCountryToCountryArray(restCountries: RESTCountry[]): Country[] {
    return restCountries.map(this.mapRestCountryToCountry);
  }
}
