
import React, { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import allCountries from "@/lib/allCountries.json";
import { cn } from "@/lib/utils";

export interface CountrySelectProps {
  value: string;
  onChange: (value: string, code?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({ value, onChange, disabled, placeholder, className }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute selected country label
  const selected = allCountries.find(c => c.name === value);

  // Filter countries based on search term
  const filteredCountries = searchTerm 
    ? allCountries.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : allCountries;

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          "flex w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
        onClick={() => !disabled && setOpen(!open)}
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
            <CommandInput 
              placeholder="Search country..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList className="max-h-64 overflow-auto">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.name}
                    className="cursor-pointer"
                    onSelect={() => {
                      onChange(country.name, country.code);
                      setOpen(false);
                      setSearchTerm("");
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
