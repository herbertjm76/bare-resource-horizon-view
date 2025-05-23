
import React from 'react';
import { PeriodSelector } from './PeriodSelector';
import { FilterBadges } from './FilterBadges';

interface ProjectResourceFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  searchTerm: string;
  onFilterChange: (key: string, value: string) => void;
  onPeriodChange: (period: number) => void;
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
  onPeriodChange,
  onSearchChange,
  officeOptions,
  countryOptions,
  managers,
  activeFiltersCount
}) => {
  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-1 gap-4">
        <PeriodSelector
          selectedPeriod={filters.periodToShow}
          onPeriodChange={onPeriodChange}
        />
        
        {/* Office filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Office</label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.office}
            onChange={(e) => onFilterChange('office', e.target.value)}
          >
            <option value="all">All Offices</option>
            {officeOptions.map(office => (
              <option key={office} value={office}>{office}</option>
            ))}
          </select>
        </div>
        
        {/* Country filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Country</label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.country}
            onChange={(e) => onFilterChange('country', e.target.value)}
          >
            <option value="all">All Countries</option>
            {countryOptions.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        
        {/* Manager filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Manager</label>
          <select
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={filters.manager}
            onChange={(e) => onFilterChange('manager', e.target.value)}
          >
            <option value="all">All Managers</option>
            {managers.map(manager => (
              <option key={manager.id} value={manager.id}>{manager.name}</option>
            ))}
          </select>
        </div>
        
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Projects</label>
          <input
            type="text"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or code..."
          />
        </div>
      </div>
      
      <FilterBadges
        filters={filters}
        searchTerm={searchTerm}
        onFilterChange={onFilterChange}
        onSearchChange={onSearchChange}
      />
    </div>
  );
};
