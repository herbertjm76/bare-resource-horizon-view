
import { useState, useEffect } from "react";
import { CITIES_BY_COUNTRY } from "./cityData";

export const useCitySelect = (country: string, onChange: (value: string) => void) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset state when country changes - this should be stable
  useEffect(() => {
    console.log('useCitySelect: Country changed to:', country);
    setOpen(false);
    setSearchTerm("");
  }, [country]);

  // Get suggested cities for the selected country
  const suggestedCities = country ? CITIES_BY_COUNTRY[country] || [] : [];
  
  // Debug logging to see what's happening
  console.log('useCitySelect: Current country:', country);
  console.log('useCitySelect: Available countries in data:', Object.keys(CITIES_BY_COUNTRY));
  console.log('useCitySelect: Suggested cities:', suggestedCities);

  // Filter cities based on search term
  let displayedCities: string[];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    displayedCities = suggestedCities.filter(city =>
      city.toLowerCase().includes(term)
    );
  } else {
    displayedCities = suggestedCities;
  }

  const handleCitySelect = (city: string) => {
    onChange(city);
    setOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm && !displayedCities.includes(searchTerm)) {
      // Allow custom city entry
      onChange(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleToggleOpen = () => {
    if (country) {
      setOpen(!open);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {
    open,
    searchTerm,
    displayedCities,
    handleCitySelect,
    handleKeyDown,
    handleToggleOpen,
    handleClose,
    setSearchTerm
  };
};
