
import { Country } from './types';
import { europeanCountries } from './europe';
import { asianCountries } from './asia';
import { americanCountries } from './americas';
import { africanCountries } from './africa';
import { oceaniaCountries } from './oceania';

export const allCountries: Country[] = [
  ...europeanCountries,
  ...asianCountries,
  ...americanCountries,
  ...africanCountries,
  ...oceaniaCountries
].sort((a, b) => a.name.localeCompare(b.name));

export { Country, CountryGroup } from './types';
export { europeanCountries } from './europe';
export { asianCountries } from './asia';
export { americanCountries } from './americas';
export { africanCountries } from './africa';
export { oceaniaCountries } from './oceania';
