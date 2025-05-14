
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { FilterBadges } from '@/components/resources/filters/FilterBadges';
import { WeeksToShowSelector } from '@/components/resources/filters/WeeksToShowSelector';
import { X } from 'lucide-react';

interface ProjectResourceFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    weeksToShow: number;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string) => void;
  onWeeksChange: (weeks: number) => void;
  onSearchChange: (value: string) => void;
  officeOptions: string[];
  countryOptions: string[];
  managers: Array<{id: string, name: string}>;
  activeFiltersCount: number;
}

export const ProjectResourceFilters: React.FC<ProjectResourceFiltersProps> = ({
  filters,
  searchTerm,
  onFilterChange,
  onWeeksChange,
  onSearchChange,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Office</label>
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
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Country</label>
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
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Project Manager</label>
        <Select 
          value={filters.manager}
          onValueChange={(value) => onFilterChange('manager', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Project Managers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Project Managers</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager.id} value={manager.id}>
                {manager.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Search</label>
        <SearchInput 
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search projects..."
        />
      </div>
      
      <WeeksToShowSelector
        weeksToShow={filters.weeksToShow}
        onWeeksChange={onWeeksChange}
      />
      
      {/* Active filter badges */}
      {activeFiltersCount > 0 && (
        <div className="mt-4 pt-4 border-t">
          <FilterBadges 
            filters={filters}
            onFilterChange={onFilterChange}
            managerOptions={managers}
            officeOptions={officeOptions}
            countryOptions={countryOptions}
          />
          {searchTerm && (
            <div className="mt-2 inline-flex items-center bg-muted/40 rounded-full text-xs py-1 pl-3 pr-1.5">
              <span className="mr-1">Search: {searchTerm}</span>
              <button 
                className="h-5 w-5 p-0 rounded-full inline-flex items-center justify-center hover:bg-muted/60"
                onClick={() => onSearchChange('')}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
