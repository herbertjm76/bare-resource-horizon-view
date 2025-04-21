
export function extractCityFromAddress(suggestion: string) {
  // Expected format: "street info, city, country"
  const parts = suggestion.split(",");
  if (parts.length >= 3) {
    return parts[parts.length - 2].trim();
  } else if (parts.length === 2) {
    return parts[0].trim();
  }
  return "";
}
