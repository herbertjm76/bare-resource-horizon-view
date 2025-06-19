
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
  console.log('useCitySelect: Search term:', searchTerm);

  // Filter cities based on search term - make search case-insensitive and more flexible
  let displayedCities: string[];
  if (searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    console.log('useCitySelect: Filtering with term:', term);
    
    // First try to match cities from the selected country
    let filteredCities = suggestedCities.filter(city =>
      city.toLowerCase().includes(term)
    );
    
    // If no cities found in selected country and search term might be a country name,
    // show cities from countries that match the search term
    if (filteredCities.length === 0) {
      const matchingCountries = Object.keys(CITIES_BY_COUNTRY).filter(countryName =>
        countryName.toLowerCase().includes(term)
      );
      
      console.log('useCitySelect: No cities found in current country, checking matching countries:', matchingCountries);
      
      if (matchingCountries.length > 0) {
        // Show cities from the first matching country
        filteredCities = CITIES_BY_COUNTRY[matchingCountries[0]] || [];
        console.log('useCitySelect: Using cities from matching country:', matchingCountries[0], filteredCities);
      }
    }
    
    displayedCities = filteredCities;
    console.log('useCitySelect: Final displayed cities:', displayedCities);
  } else {
    displayedCities = suggestedCities;
  }

  const handleCitySelect = (city: string) => {
    console.log('useCitySelect: City selected:', city);
    onChange(city);
    setOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm && !displayedCities.includes(searchTerm)) {
      console.log('useCitySelect: Adding custom city via Enter:', searchTerm);
      // Allow custom city entry
      onChange(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleToggleOpen = () => {
    if (country) {
      console.log('useCitySelect: Toggling dropdown, current open state:', open);
      setOpen(!open);
    } else {
      console.log('useCitySelect: Cannot open dropdown, no country selected');
    }
  };

  const handleClose = () => {
    console.log('useCitySelect: Closing dropdown');
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
