import allCountries from "@/lib/allCountries.json";

// Pastel background color array
export const pastelColors = [
  "#F2FCE2", "#FEF7CD", "#FEC6A1", "#E5DEFF",
  "#FFDEE2", "#FDE1D3", "#D3E4FD", "#F1F0FB"
];

// Region mapping for some countries (kept but not used for continent logic)
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

// Returns only the continent string for a given country code (e.g. 'Asia', 'Europe')
export const getContinentByCountryCode = (countryCode: string): string => {
  const continentMap: Record<string, string> = {
    'AF': 'Africa',
    'AS': 'Asia',
    'EU': 'Europe',
    'NA': 'North America',
    'SA': 'South America',
    'OC': 'Oceania',
    'AN': 'Antarctica',
  };
  // Typical country codes (ISO 3166-1 alpha-2) such as "GB", "US", "IN"
  // Map each code to the correct continent prefix using a manual lookup
  const country = allCountries.find(c => c.code === countryCode);
  if (!country) return "";

  // Mapping of ISO codes to continent
  // These could be made more precise with a full db, but here's a simple prefix check:
  const code = countryCode.toUpperCase();

  if (["US", "CA", "MX", "GT", "CU", "JM", "CR", "PA", "DO", "HN", "NI", "SV", "BZ", "BS", "BB", "HT", "KN", "LC", "VC", "TT", "AG", "DM"].includes(code))
    return "North America";
  if (["BR", "AR", "CO", "PE", "VE", "CL", "EC", "BO", "PY", "UY", "GF", "SR", "GY"].includes(code))
    return "South America";
  if (["GB", "FR", "IT", "ES", "DE", "RU", "UA", "PL", "RO", "NL", "BE", "GR", "CZ", "PT", "SE", "HU", "BY", "AT", "CH", "BG", "DK", "FI", "NO", "IE", "SK", "HR", "LT", "SI", "LV", "EE", "LU", "MD", "IS", "AL", "MT", "MC", "LI", "BA", "ME", "RS", "MK"].includes(code))
    return "Europe";
  if (["CN", "JP", "IN", "ID", "PK", "BD", "KR", "TR", "IR", "TH", "MM", "IQ", "SA", "UZ", "MY", "YE", "NP", "KP", "PH", "VN", "AE", "AF", "SY", "KZ", "AZ", "JO", "HK", "IL", "TJ", "TM", "LB", "KG", "SG", "OM", "PS", "KW", "GE", "MN", "AM", "QA", "BH", "CY", "MV", "BN", "TL"].includes(code))
    return "Asia";
  if (["NG", "ET", "EG", "CD", "TZ", "ZA", "KE", "SD", "DZ", "MA", "AO", "GH", "MZ", "MG", "CM", "CI", "NE", "BF", "MW", "ZM", "SN", "ZW", "SS", "CG", "TD", "ER", "UG", "SL", "LR", "LY", "TG", "MG", "BJ", "RW", "SO", "CF", "GM", "LS", "MR", "GA", "GQ", "BW", "GW", "SZ", "KM", "CV", "SC", "DJ", "ST", "RE", "YT", "SH", "EH"].includes(code))
    return "Africa";
  if (["AU", "NZ", "PG", "FJ", "SB", "VU", "NC", "PF", "WS", "TO", "FM", "MH", "PW", "KI", "TV", "NR", "TL", "CK", "NU", "WF"].includes(code))
    return "Oceania";
  if (["AQ", "BV", "TF", "GS", "HM"].includes(code))
    return "Antarctica";

  // Fallback: use prefix matching from UN M49 region if nothing else works
  const prefix = code.substring(0, 2);
  const fallback = {
    "AF": "Africa",
    "AS": "Asia",
    "EU": "Europe",
    "NA": "North America",
    "SA": "South America",
    "OC": "Oceania",
    "AN": "Antarctica"
  }[prefix];
  if (fallback) return fallback;

  // Otherwise, just return empty string if we can't guess
  return "";
};

// Modify getPastelColor to return a color based on the code or name
export function getPastelColor(input: string): string {
  // Use a simple hash function to generate a consistent color based on the input
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to select a color from the pastel array
  return pastelColors[Math.abs(hash) % pastelColors.length];
}
