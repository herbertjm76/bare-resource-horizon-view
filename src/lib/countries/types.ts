
export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface CountryGroup {
  name: string;
  countries: Country[];
}
