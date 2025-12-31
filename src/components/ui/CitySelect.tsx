
import React from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { CitySelectButton } from "./citySelect/CitySelectButton";
import { useCitySelect } from "./citySelect/useCitySelect";
import { CitySelectProps } from "./citySelect/types";
import { logger } from '@/utils/logger';

export const CitySelect: React.FC<CitySelectProps> = ({
  value,
  onChange,
  country,
  disabled,
  placeholder,
  className
}) => {
  logger.debug('CitySelect: Received props:', {
    value,
    country,
    disabled,
    placeholder,
    className
  });

  const {
    open,
    searchTerm,
    displayedCities,
    handleCitySelect,
    handleKeyDown,
    handleToggleOpen,
    handleClose,
    setSearchTerm
  } = useCitySelect(country, onChange);

  logger.debug('CitySelect: Hook returned:', {
    open,
    searchTerm,
    displayedCitiesCount: displayedCities.length,
    firstFewCities: displayedCities.slice(0, 3)
  });

  return (
    <div className="relative">
      <CitySelectButton
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        country={country}
        className={className}
        onClick={handleToggleOpen}
      />

      {open && country && (
        <div className="absolute z-50 w-full mt-2 bg-popover border border-border rounded-md shadow-xl">
          <Command>
            <CommandInput 
              placeholder="Search or enter city name..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
              onKeyDown={handleKeyDown}
            />
            <CommandList className="max-h-64 overflow-auto">
              {displayedCities.length > 0 ? (
                displayedCities.map((city) => (
                  <CommandItem
                    key={city}
                    value={city}
                    className="cursor-pointer hover:bg-gray-100"
                    onSelect={() => handleCitySelect(city)}
                  >
                    <span>{city}</span>
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>
                  {searchTerm ? (
                    <div className="p-2">
                      <div className="text-sm text-gray-600 mb-2">
                        No cities found. Press Enter to add "{searchTerm}"
                      </div>
                      <button
                        className="text-sm text-blue-600 hover:underline"
                        onClick={() => handleCitySelect(searchTerm)}
                      >
                        Add "{searchTerm}"
                      </button>
                    </div>
                  ) : (
                    "No cities available"
                  )}
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default CitySelect;
