
import { useState, useEffect } from "react";
import { CITIES_BY_COUNTRY } from "./cityData";
import { logger } from "@/utils/logger";

export const useCitySelect = (country: string, onChange: (value: string) => void) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Reset state when country changes - this should be stable
  useEffect(() => {
    logger.debug('useCitySelect: Country changed to:', country);
    setOpen(false);
    setSearchTerm("");
  }, [country]);

  // Get suggested cities for the selected country
  const suggestedCities = country ? CITIES_BY_COUNTRY[country] || [] : [];
  
  // Debug logging to see what's happening
  logger.debug('useCitySelect: Current country:', country);
  logger.debug('useCitySelect: Suggested cities for country:', suggestedCities.slice(0, 5));

  // Filter cities based on search term - improved logic
  let displayedCities: string[];
  if (searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    logger.debug('useCitySelect: Filtering with term:', term);
    
    // First try to match cities from the selected country
    let filteredCities = suggestedCities.filter(city =>
      city.toLowerCase().includes(term)
    );
    
    logger.debug('useCitySelect: Cities found in current country:', filteredCities);
    
    // If no cities found in selected country, search across all countries
    if (filteredCities.length === 0) {
      logger.debug('useCitySelect: No cities found in current country, searching all countries');
      
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
      
      logger.debug('useCitySelect: Matching countries:', matchingCountries);
      
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
      logger.debug('useCitySelect: All matching cities found:', filteredCities);
    }
    
    displayedCities = filteredCities;
    logger.debug('useCitySelect: Final displayed cities:', displayedCities);
  } else {
    displayedCities = suggestedCities;
  }

  const handleCitySelect = (city: string) => {
    logger.debug('useCitySelect: City selected:', city);
    onChange(city);
    setOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm && !displayedCities.includes(searchTerm)) {
      logger.debug('useCitySelect: Adding custom city via Enter:', searchTerm);
      // Allow custom city entry
      onChange(searchTerm);
      setOpen(false);
      setSearchTerm("");
    }
  };

  const handleToggleOpen = () => {
    logger.debug('useCitySelect: handleToggleOpen called');
    logger.debug('useCitySelect: Country for toggle:', country);
    
    if (country && country.trim() !== '') {
      logger.debug('useCitySelect: Toggling dropdown, current open state:', open);
      setOpen(!open);
    } else {
      logger.debug('useCitySelect: Cannot open dropdown, no country selected');
    }
  };

  const handleClose = () => {
    logger.debug('useCitySelect: Closing dropdown');
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
