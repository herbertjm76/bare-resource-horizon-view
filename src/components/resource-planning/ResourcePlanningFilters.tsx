
import React from 'react';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { PeriodSelector } from '@/components/resources/filters/PeriodSelector';

interface ResourcePlanningFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const ResourcePlanningFilters: React.FC<ResourcePlanningFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <PeriodSelector
            selectedPeriod={filters.periodToShow}
            onPeriodChange={(period) => onFilterChange('periodToShow', period.toString())}
          />
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Office</label>
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={filters.office}
              onChange={(e) => onFilterChange('office', e.target.value)}
            >
              <option value="all">All Offices</option>
              <option value="london">London</option>
              <option value="new-york">New York</option>
              <option value="toronto">Toronto</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Country</label>
            <select
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
              value={filters.country}
              onChange={(e) => onFilterChange('country', e.target.value)}
            >
              <option value="all">All Countries</option>
              <option value="uk">United Kingdom</option>
              <option value="us">United States</option>
              <option value="ca">Canada</option>
            </select>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
