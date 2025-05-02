
import React from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdvancedFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  onFilterChange: (key: string, value: string) => void;
  officeOptions: string[];
  countryOptions: string[];
  managerOptions: {id: string, name: string}[];
  clearFilters: () => void;
  activeFiltersCount: number;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  officeOptions,
  countryOptions,
  managerOptions,
  clearFilters,
  activeFiltersCount
}) => {
  return (
    <>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h3 className="font-medium">Advanced Filters</h3>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm"
            className="text-xs h-7 px-2"
            onClick={clearFilters}
          >
            <X className="w-3 h-3 mr-1" />
            Clear all filters
          </Button>
        )}
      </div>
      <Separator />
      
      <div className="p-4 grid gap-4">
        {/* Office Filter */}
        <div className="grid gap-1.5">
          <label className="text-xs font-medium">Office</label>
          <Select 
            value={filters.office}
            onValueChange={(value) => onFilterChange('office', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Offices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              {officeOptions.map((office) => (
                <SelectItem key={office} value={office}>
                  {office}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Country Filter */}
        <div className="grid gap-1.5">
          <label className="text-xs font-medium">Country</label>
          <Select 
            value={filters.country}
            onValueChange={(value) => onFilterChange('country', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Countries" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countryOptions.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Manager Filter */}
        <div className="grid gap-1.5">
          <label className="text-xs font-medium">Project Manager</label>
          <Select 
            value={filters.manager}
            onValueChange={(value) => onFilterChange('manager', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Project Managers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Project Managers</SelectItem>
              {managerOptions.map((manager) => (
                <SelectItem key={manager.id} value={manager.id}>
                  {manager.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
};
