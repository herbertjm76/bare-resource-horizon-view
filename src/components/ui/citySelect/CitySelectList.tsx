
import React from "react";
import { CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { CitySelectListProps } from "./types";

export const CitySelectList: React.FC<CitySelectListProps> = ({
  cities,
  onCitySelect,
  searchTerm
}) => {
  return (
    <CommandList className="max-h-64 overflow-auto">
      {cities.length > 0 ? (
        cities.map((city) => (
          <CommandItem
            key={city}
            value={city}
            className="cursor-pointer"
            onSelect={() => onCitySelect(city)}
          >
            <span>{city}</span>
          </CommandItem>
        ))
      ) : (
        <CommandEmpty>
          {searchTerm ? (
            <div className="p-2">
              <div className="text-sm text-muted-foreground mb-2">
                No cities found. Press Enter to add "{searchTerm}"
              </div>
              <button
                className="text-sm text-primary hover:underline"
                onClick={() => onCitySelect(searchTerm)}
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
  );
};
