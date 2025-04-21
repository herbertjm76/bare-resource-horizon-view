
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader, MapPin, Search } from "lucide-react";

interface AddressAutocompleteProps {
  value: string;
  country: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
  // NEW: onSelectSuggestion receives both address and parsed city
  onSelectSuggestion?: (addr: string, city: string) => void;
}

// This function simulates fetching address suggestions
// In a production app, you would replace this with a real API call
// to Google Places API, Mapbox, or similar geocoding service
const mockFetchAddresses = async (query: string, country: string) => {
  // Don't perform search if query is too short
  if (!query || query.length < 2 || !country) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Generate realistic suggestions based on query and country
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
    // Add cities for other countries as needed
  };
  
  const selectedCities = cities[country as keyof typeof cities] || ["City"];
  
  // Create realistic address suggestions
  const suggestions = [];
  
  // Add exact match suggestion if query is substantial
  if (query.length > 3) {
    suggestions.push(`${query}, ${selectedCities[0]}, ${country}`);
  }
  
  // Add street number suggestions
  for (let i = 0; i < Math.min(streets.length, 5); i++) {
    const randomNum = Math.floor(Math.random() * 200) + 1;
    const cityIndex = Math.floor(Math.random() * selectedCities.length);
    suggestions.push(`${randomNum} ${query} ${streets[i]}, ${selectedCities[cityIndex]}, ${country}`);
  }
  
  // Add business/landmark suggestions
  const businesses = ["Plaza", "Tower", "Building", "Center", "Mall", "Park", "Complex"];
  for (let i = 0; i < Math.min(businesses.length, 3); i++) {
    const cityIndex = Math.floor(Math.random() * selectedCities.length);
    suggestions.push(`${query} ${businesses[i]}, ${selectedCities[cityIndex]}, ${country}`);
  }
  
  return suggestions;
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  country,
  onChange,
  placeholder = "Start typing address...",
  disabled,
  onSelectSuggestion,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update search term when value changes from outside
  useEffect(() => {
    setSearchTerm(value);
  }, [value]);
  
  // Debounced search for address suggestions
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Only search if there's a valid search term and country
    if (searchTerm && country) {
      setLoading(true);
      
      // Set a new debounce timer
      debounceTimerRef.current = setTimeout(async () => {
        try {
          const results = await mockFetchAddresses(searchTerm, country);
          setSuggestions(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce time
    } else {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
    }
    
    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchTerm, country]);

  // Hide dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  // Helper: Parse city from suggestion
  const extractCity = (suggestion: string) => {
    // Expected format: "street info, city, country"
    const parts = suggestion.split(",");
    if (parts.length >= 3) {
      return parts[parts.length - 2].trim();
    } else if (parts.length === 2) {
      return parts[0].trim(); // fallback
    }
    return "";
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSearchTerm(suggestion);
    setShowDropdown(false);
    
    // Call onSelectSuggestion with both address and city if provided
    if (onSelectSuggestion) {
      const city = extractCity(suggestion);
      console.log("Selecting suggestion:", suggestion, "City:", city);
      onSelectSuggestion(suggestion, city);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="mt-1 pr-10"
          onFocus={() => {
            if (searchTerm && suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
      </div>
      
      {loading && (
        <span className="block text-xs text-gray-400 mt-1">Searching addresses...</span>
      )}
      
      {(showDropdown && suggestions.length > 0) && (
        <ul className="absolute left-0 right-0 top-full z-50 bg-background shadow-lg border mt-1 rounded-md max-h-48 overflow-auto">
          {suggestions.map((addr, idx) => (
            <li
              key={addr + idx}
              className="cursor-pointer hover:bg-accent px-3 py-2 text-sm flex items-center"
              onClick={() => handleSuggestionClick(addr)}
            >
              <MapPin className="h-4 w-4 mr-2 text-gray-400" />
              <span>{addr}</span>
            </li>
          ))}
        </ul>
      )}
      
      {searchTerm && !loading && country && suggestions.length === 0 && (
        <span className="block text-xs text-gray-400 mt-1">
          No address suggestions found. Try entering more details.
        </span>
      )}
    </div>
  );
};
export default AddressAutocomplete;
