
import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

interface AddressAutocompleteProps {
  value: string;
  country: string;
  onChange: (address: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const mockFetchAddresses = async (query: string, country: string) => {
  // Placeholder/mocked address suggestions for now
  // In real integration, connect to Google, Mapbox API, etc.
  // You can swap this function later for a real service!
  if (!query) return [];
  return [
    `${query} Main Street, ${country}`,
    `${query} Center Avenue, ${country}`,
    `${query} Business Park, ${country}`,
    `${query} Industrial Road, ${country}`,
  ];
};

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  country,
  onChange,
  placeholder = "Start typing address...",
  disabled,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && country) {
      setLoading(true);
      mockFetchAddresses(value, country).then((results) => {
        setSuggestions(results);
        setShowDropdown(results.length > 0);
        setLoading(false);
      });
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [value, country]);

  // Hide dropdown on outside click
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

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={e => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        className="mt-1"
      />
      {loading && (
        <span className="block text-xs text-gray-400 mt-1">Searching...</span>
      )}
      {(showDropdown && suggestions.length > 0) && (
        <ul className="absolute left-0 right-0 top-full z-50 bg-background shadow-lg border mt-1 rounded-md max-h-48 overflow-auto">
          {suggestions.map((addr, idx) => (
            <li
              key={addr + idx}
              className="cursor-pointer hover:bg-accent px-3 py-2 text-sm"
              onClick={() => {
                onChange(addr);
                setShowDropdown(false);
              }}
            >
              {addr}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default AddressAutocomplete;
