
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Loader, MapPin, Search } from "lucide-react";
import { useAddressSuggestions } from "./useAddressSuggestions";
import { extractCityFromAddress } from "./extractCityFromAddress";
import AddressSuggestionList from "./AddressSuggestionList";
import { cn } from "@/lib/utils";

interface AddressAutocompleteProps {
  value: string;
  country: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onSelectSuggestion?: (addr: string, city: string) => void;
  className?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  country,
  onChange,
  placeholder = "Start typing address...",
  disabled,
  onSelectSuggestion,
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useAddressSuggestions(searchTerm, country);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (value && !searchTerm) {
      setSearchTerm(value);
    }
  }, [value]);

  return (
    <div className="relative" ref={containerRef}>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value);
          if (e.target.value.length > 0) {
            setShowDropdown(true);
          } else {
            setShowDropdown(false);
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className={cn("mt-1 pr-10", className)}
        onFocus={() => {
          if (searchTerm && suggestions.length > 0) {
            setShowDropdown(true);
          }
        }}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {suggestions.length > 0 ? (
          <Search size={18} />
        ) : !showDropdown ? (
          <MapPin size={18} />
        ) : (
          <Loader className="animate-spin" size={18} />
        )}
      </div>
      {showDropdown && suggestions.length > 0 && (
        <AddressSuggestionList
          suggestions={suggestions}
          onSelect={(address) => {
            onChange(address);
            const city = extractCityFromAddress(address);
            if (onSelectSuggestion) {
              onSelectSuggestion(address, city);
            }
            setShowDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default AddressAutocomplete;
