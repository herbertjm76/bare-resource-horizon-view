
import React, { useState } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import allCountries from "@/lib/allCountries.json";
import { cn } from "@/lib/utils";

export interface CountrySelectProps {
  value: string;
  onChange: (value: string, code?: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);

  // Compute selected country label
  const selected = allCountries.find(c => c.name === value);

  return (
    <div>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => setOpen(!open)}
        disabled={disabled}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? selected?.name : (placeholder || "Select country")}
        </span>
        <svg className="h-4 w-4 ml-2 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-muted rounded-md shadow-xl">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList className="max-h-64 overflow-auto">
              {allCountries?.length ? (
                allCountries.map((country) => (
                  <CommandItem
                    key={country.name}
                    value={country.name}
                    className="cursor-pointer"
                    onSelect={() => {
                      onChange(country.name, country.code);
                      setOpen(false);
                    }}
                  >
                    {country.name}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No countries found.</CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
};

export default CountrySelect;
