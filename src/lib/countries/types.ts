
export interface Country {
  code: string;
  name: string;
}

export interface CountryGroup {
  name: string;
  countries: Country[];
}
