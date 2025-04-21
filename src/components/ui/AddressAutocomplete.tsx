
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
  const inputRef = useRef<HTMLInputElement>(null);

  const { suggestions, loading, fetchSuggestions, setSuggestions } = useAddressSuggestions();

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    if (searchTerm && country) {
      fetchSuggestions(searchTerm, country);
      setShowDropdown(true);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchTerm, country, fetchSuggestions, setSuggestions]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDropdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setSearchTerm(suggestion);
    setShowDropdown(false);
    if (onSelectSuggestion) {
      const city = extractCityFromAddress(suggestion);
      console.log("Selecting suggestion:", suggestion, "City:", city);
      onSelectSuggestion(suggestion, city);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={handleInputChange}
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
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </div>
      </div>
      {loading && (
        <span className="block text-xs text-gray-400 mt-1">Searching addresses...</span>
      )}
      {(showDropdown && suggestions.length > 0) && (
        <AddressSuggestionList
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
      {searchTerm && !loading && country && suggestions.length === 0 && (
        <span className="block text-xs text-gray-400 mt-1">
          No address suggestions found. Try entering more details.
        </span>
      )}
    </div>
  );
};

export default AddressAutocomplete;
