
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search projects...", 
  className = ""
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9 pr-10 bg-background"
      />
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-0"
          onClick={() => onChange('')}
        >
          <X className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
};
