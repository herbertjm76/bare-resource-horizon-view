
import React from "react";
import { CommandInput } from "@/components/ui/command";

interface CitySelectInputProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CitySelectInput: React.FC<CitySelectInputProps> = ({
  searchTerm,
  onSearchChange,
  onKeyDown
}) => {
  return (
    <CommandInput 
      placeholder="Search or enter city name..." 
      value={searchTerm}
      onValueChange={onSearchChange}
      onKeyDown={onKeyDown}
    />
  );
};
