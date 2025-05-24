
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResourcePlanningGrid } from './ResourcePlanningGrid';
import { ResourcePlanningFilters } from './ResourcePlanningFilters';
import { MonthYearSelector } from '@/components/resources/filters/MonthYearSelector';
import { SearchInput } from '@/components/resources/filters/SearchInput';
import { startOfMonth, addWeeks } from 'date-fns';

interface ResourcePlanningContentProps {
  selectedMonth: Date;
  searchTerm: string;
  filters: {
    office: string;
    country: string;
    manager: string;
    periodToShow: number;
  };
  onMonthChange: (month: Date) => void;
  onSearchChange: (term: string) => void;
  onFilterChange: (key: string, value: string) => void;
}

export const ResourcePlanningContent: React.FC<ResourcePlanningContentProps> = ({
  selectedMonth,
  searchTerm,
  filters,
  onMonthChange,
  onSearchChange,
  onFilterChange
}) => {
  // Calculate start date and period
  const startDate = startOfMonth(selectedMonth);
  const endDate = addWeeks(startDate, filters.periodToShow);

  return (
    <div className="max-w-full space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-brand-primary">Resource Planning</h1>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={onSearchChange}
              placeholder="Search projects..."
            />
          </div>
          <MonthYearSelector
            selectedMonth={selectedMonth}
            onChange={onMonthChange}
          />
          <ResourcePlanningFilters
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>
      </div>

      {/* Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Allocation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ResourcePlanningGrid
            startDate={startDate}
            periodToShow={filters.periodToShow}
            filters={{
              office: filters.office,
              country: filters.country,
              manager: filters.manager,
              searchTerm
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};
