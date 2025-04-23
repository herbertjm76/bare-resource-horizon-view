
import allCountries from "@/lib/allCountries.json";
import { getContinentByCountryCode } from "./projectAreaHelpers";
import type { ProjectArea, ProjectAreaRow } from "./projectAreaTypes";

// Helper: given a country name, find the region
export function getAutoRegion(country: string): string {
  const countryData = allCountries.find((c) => c.name === country);
  if (countryData) {
    return getContinentByCountryCode(countryData.code);
  }
  return "";
}

// Helper: convert from DB row to ProjectArea
export function toProjectArea(area: ProjectAreaRow): ProjectArea {
  return {
    id: area.id,
    code: area.code,
    region: getAutoRegion(area.name),
    country: area.name,
    company_id: area.company_id ?? null,
    city: area.city,
    color: area.color,
  };
}
