
import { useState, useRef, useEffect } from "react";

// This function simulates fetching address suggestions
const mockFetchAddresses = async (query: string, country: string) => {
  if (!query || query.length < 2 || !country) return [];
  await new Promise(resolve => setTimeout(resolve, 300));
  const streets = [
    "Main Street", "High Street", "Park Avenue", "Broadway", 
    "Oak Lane", "Maple Road", "Church Street", "Market Street",
    "Station Road", "Victoria Street", "King Street", "Queen Street"
  ];
  const cities = {
    "United States": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    "United Kingdom": ["London", "Manchester", "Birmingham", "Liverpool", "Glasgow"],
    "Canada": ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"],
    "Australia": ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"],
  };
  const selectedCities = cities[country as keyof typeof cities] || ["City"];
  const suggestions = [];
  if (query.length > 3) {
    suggestions.push(`${query}, ${selectedCities[0]}, ${country}`);
  }
  for (let i = 0; i < Math.min(streets.length, 5); i++) {
    const randomNum = Math.floor(Math.random() * 200) + 1;
    const cityIndex = Math.floor(Math.random() * selectedCities.length);
    suggestions.push(`${randomNum} ${query} ${streets[i]}, ${selectedCities[cityIndex]}, ${country}`);
  }
  const businesses = ["Plaza", "Tower", "Building", "Center", "Mall", "Park", "Complex"];
  for (let i = 0; i < Math.min(businesses.length, 3); i++) {
    const cityIndex = Math.floor(Math.random() * selectedCities.length);
    suggestions.push(`${query} ${businesses[i]}, ${selectedCities[cityIndex]}, ${country}`);
  }
  return suggestions;
};

type UseAddressSuggestionsResult = {
  suggestions: string[];
  loading: boolean;
  fetchSuggestions: (searchTerm: string, country: string) => void;
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
};

export function useAddressSuggestions() : UseAddressSuggestionsResult {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = (searchTerm: string, country: string) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (!searchTerm || !country) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await mockFetchAddresses(searchTerm, country);
        setSuggestions(results);
      } catch (e) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  return { suggestions, loading, fetchSuggestions, setSuggestions };
}
