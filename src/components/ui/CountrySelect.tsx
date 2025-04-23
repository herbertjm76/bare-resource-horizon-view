
import React, { useState, useEffect, useRef } from "react";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command";
import { allCountries } from "@/lib/countries"; // Updated import
import { cn } from "@/lib/utils";

export interface CountrySelectProps {
  value: string;
  onChange: (value: string, code?: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  majorCountries?: string[];
}

// These are typical "major" countries people select most
const DEFAULT_MAJOR_COUNTRIES = [
  "United States",
  "United Kingdom",
  "Canada",
  "Germany",
  "France",
  "India",
  "China",
  "Australia",
  "Japan",
  "Brazil"
];

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  disabled,
  placeholder,
  className,
  majorCountries = DEFAULT_MAJOR_COUNTRIES
}) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Compute selected country
  const selected = allCountries.find(c => c.name === value);

  // Sort major countries at the top
  const majorList = allCountries.filter(c =>
    majorCountries.includes(c.name)
  );

  // Alphabetical list excluding majors
  const otherCountries = allCountries
    .filter(c => !majorCountries.includes(c.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Search both lists and combine - search result always on top
  let displayedCountries: typeof allCountries;
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    displayedCountries = [
      ...allCountries
        .filter(c => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
        .sort((a, b) => a.name.localeCompare(b.name)),
    ];
  } else {
    displayedCountries = [...majorList, ...otherCountries];
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
        id="country"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>
          {value ? selected?.name : (placeholder || "Select country")}
        </span>
        <svg className="h-4 w-4 ml-2 opacity-60" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
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
              {/* Show Major Countries group if not searching */}
              {!searchTerm && (
                <>
                  <div className="px-2 py-1 text-xs uppercase text-muted-foreground">Popular</div>
                  {majorList.map(country => (
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
                  ))}
                  <div className="border-t my-1" />
                  <div className="px-2 py-1 text-xs uppercase text-muted-foreground">All countries</div>
                </>
              )}
              {/* Show filtered list if searching */}
              {displayedCountries.length > 0 ? (
                displayedCountries.map((country) => (
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
