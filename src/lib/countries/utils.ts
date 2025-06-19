
import { allCountries } from './index';

export const getCountryByName = (name: string) => {
  return allCountries.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  );
};

export const getCountryByCode = (code: string) => {
  return allCountries.find(country => 
    country.code.toLowerCase() === code.toLowerCase()
  );
};

export const getCountryFlag = (countryName: string): string => {
  const country = getCountryByName(countryName);
  return country?.flag || '';
};

export const searchCountries = (query: string) => {
  const searchTerm = query.toLowerCase();
  return allCountries.filter(country =>
    country.name.toLowerCase().includes(searchTerm) ||
    country.code.toLowerCase().includes(searchTerm)
  );
};
