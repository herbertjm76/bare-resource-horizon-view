
import React, { useEffect, useRef } from "react";
import { Command } from "@/components/ui/command";
import { CitySelectInput } from "./CitySelectInput";
import { CitySelectList } from "./CitySelectList";
import { CitySelectDropdownProps } from "./types";

export const CitySelectDropdown: React.FC<CitySelectDropdownProps> = ({
  open,
  onClose,
  country,
  onCitySelect,
  searchTerm,
  onSearchChange,
  onKeyDown
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open || !country) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute z-50 w-full mt-2 bg-background border border-muted rounded-md shadow-xl"
    >
      <Command>
        <CitySelectInput
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onKeyDown={onKeyDown}
        />
        <CitySelectList
          cities={[]} // This will be populated by the parent component
          onCitySelect={onCitySelect}
          searchTerm={searchTerm}
        />
      </Command>
    </div>
  );
};
