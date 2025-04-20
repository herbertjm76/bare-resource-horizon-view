
import allCountries from "@/lib/allCountries.json";

// Pastel background color array
export const pastelColors = [
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
  "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB"
];

// Region mapping for some countries
export const countryRegions: Record<string, string[]> = {
  "United States": ["North America"],
  "Canada": ["North America"],
  "Mexico": ["North America", "Latin America"],
  "United Kingdom": ["Europe", "Western Europe"],
  "France": ["Europe", "Western Europe"],
  "Germany": ["Europe", "Western Europe"],
  "Italy": ["Europe", "Southern Europe"],
  "Spain": ["Europe", "Southern Europe"],
  "Russia": ["Europe", "Asia", "Eastern Europe"],
  "China": ["Asia", "East Asia"],
  "Japan": ["Asia", "East Asia"],
  "South Korea": ["Asia", "East Asia"],
  "India": ["Asia", "South Asia"],
  "Australia": ["Oceania"],
  "New Zealand": ["Oceania"],
  "Brazil": ["South America", "Latin America"],
  "Argentina": ["South America", "Latin America"],
  "South Africa": ["Africa"],
  "Nigeria": ["Africa", "West Africa"],
  "Egypt": ["Africa", "North Africa", "Middle East"],
  "Saudi Arabia": ["Middle East"],
  "United Arab Emirates": ["Middle East"]
};

// Returns a suggested continent/region string given a country code
export const getContinentByCountryCode = (countryCode: string): string => {
  const continentMap: Record<string, string> = {
    'AF': 'Africa',
    'AS': 'Asia',
    'EU': 'Europe',
    'NA': 'North America',
    'SA': 'South America',
    'OC': 'Oceania',
    'AN': 'Antarctica'
  };

  const country = allCountries.find(c => c.code === countryCode);
  if (!country) return "";

  // Prefer explicit region
  for (const [countryName, regions] of Object.entries(countryRegions)) {
    if (country.name === countryName && regions.length > 0) {
      return regions[0];
    }
  }

  // Fall back to prefix
  for (const [prefix, continent] of Object.entries(continentMap)) {
    if (countryCode.startsWith(prefix)) {
      return continent;
    }
  }

  return "";
};

export function getPastelColor(index: number) {
  return pastelColors[index % pastelColors.length];
}
