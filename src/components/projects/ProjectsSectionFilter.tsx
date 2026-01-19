import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from 'lucide-react';

interface ProjectsSectionFilterProps {
  filters: { [key: string]: string };
  onFilterChange: (key: string, value: string) => void;
  statuses: string[];
  countries: string[];
  departments: string[];
  stages: string[];
  managers: string[];
}

export const ProjectsSectionFilter: React.FC<ProjectsSectionFilterProps> = ({
  filters,
  onFilterChange,
  statuses,
  countries,
  departments,
  stages,
  managers,
}) => {
  const hasActiveFilters = Object.values(filters).some(v => v && v !== '');

  const handleClearAll = () => {
    onFilterChange('search', '');
    onFilterChange('status', '');
    onFilterChange('country', '');
    onFilterChange('department', '');
    onFilterChange('stage', '');
    onFilterChange('pm', '');
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 rounded-lg border mb-4">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={filters.search || ''}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Status Filter */}
      <Select
        value={filters.status || 'all'}
        onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Country Filter */}
      <Select
        value={filters.country || 'all'}
        onValueChange={(value) => onFilterChange('country', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Department Filter */}
      <Select
        value={filters.department || 'all'}
        onValueChange={(value) => onFilterChange('department', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Depts</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>
              {dept}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Stage Filter */}
      <Select
        value={filters.stage || 'all'}
        onValueChange={(value) => onFilterChange('stage', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-[130px]">
          <SelectValue placeholder="Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* PM Filter */}
      <Select
        value={filters.pm || 'all'}
        onValueChange={(value) => onFilterChange('pm', value === 'all' ? '' : value)}
      >
        <SelectTrigger className="h-9 w-[140px]">
          <SelectValue placeholder="PM" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All PMs</SelectItem>
          {managers.map((manager) => (
            <SelectItem key={manager} value={manager}>
              {manager}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Clear All Button */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="h-9 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
};
