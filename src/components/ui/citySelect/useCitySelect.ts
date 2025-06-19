
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
  console.log('useCitySelect: Country is truthy?', !!country);
  console.log('useCitySelect: Available countries in data:', Object.keys(CITIES_BY_COUNTRY).slice(0, 10)); // Show first 10
  console.log('useCitySelect: Suggested cities for country:', suggestedCities.slice(0, 5)); // Show first 5
  console.log('useCitySelect: Search term:', searchTerm);
  console.log('useCitySelect: Dropdown open?', open);

  // Filter cities based on search term - improved logic
  let displayedCities: string[];
  if (searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    console.log('useCitySelect: Filtering with term:', term);
    
    // First try to match cities from the selected country
    let filteredCities = suggestedCities.filter(city =>
      city.toLowerCase().includes(term)
    );
    
    console.log('useCitySelect: Cities found in current country:', filteredCities);
    
    // If no cities found in selected country, search across all countries
    if (filteredCities.length === 0) {
      console.log('useCitySelect: No cities found in current country, searching all countries');
      
      // Search for cities across all countries
      const allCities: string[] = [];
      Object.entries(CITIES_BY_COUNTRY).forEach(([countryName, cities]) => {
        cities.forEach(city => {
          if (city.toLowerCase().includes(term)) {
            allCities.push(city);
          }
        });
      });
      
      // Also check if the search term matches a country name and include its cities
      const matchingCountries = Object.keys(CITIES_BY_COUNTRY).filter(countryName =>
        countryName.toLowerCase().includes(term)
      );
      
      console.log('useCitySelect: Matching countries:', matchingCountries);
      
      if (matchingCountries.length > 0) {
        // Add cities from matching countries
        matchingCountries.forEach(matchingCountry => {
          const countryCities = CITIES_BY_COUNTRY[matchingCountry] || [];
          countryCities.forEach(city => {
            if (!allCities.includes(city)) {
              allCities.push(city);
            }
          });
        });
      }
      
      filteredCities = allCities;
      console.log('useCitySelect: All matching cities found:', filteredCities);
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
    console.log('useCitySelect: handleToggleOpen called');
    console.log('useCitySelect: Country for toggle:', country);
    console.log('useCitySelect: Country is truthy for toggle?', !!country);
    
    if (country && country.trim() !== '') {
      console.log('useCitySelect: Toggling dropdown, current open state:', open);
      setOpen(!open);
    } else {
      console.log('useCitySelect: Cannot open dropdown, no country selected. Country value:', JSON.stringify(country));
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
