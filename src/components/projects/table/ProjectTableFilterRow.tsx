import React from 'react';
import { TableHead, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProjectTableFilterRowProps {
  editMode: boolean;
  filters: { [key: string]: string };
  onFilterChange: (key: string, value: string) => void;
  statuses: string[];
  countries: string[];
  departments: string[];
  stages: string[];
  managers: string[];
}

export const ProjectTableFilterRow: React.FC<ProjectTableFilterRowProps> = ({
  editMode,
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
    onFilterChange('code', '');
    onFilterChange('name', '');
    onFilterChange('pm', '');
    onFilterChange('status', '');
    onFilterChange('country', '');
    onFilterChange('department', '');
    onFilterChange('stage', '');
  };

  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      {editMode && <TableHead className="w-10 p-1" />}
      
      {/* Code Filter */}
      <TableHead className="p-1">
        <Input
          placeholder="Code..."
          value={filters.code || ''}
          onChange={(e) => onFilterChange('code', e.target.value)}
          className="h-8 text-xs"
        />
      </TableHead>
      
      {/* Name Filter */}
      <TableHead className="p-1">
        <Input
          placeholder="Name..."
          value={filters.name || ''}
          onChange={(e) => onFilterChange('name', e.target.value)}
          className="h-8 text-xs"
        />
      </TableHead>
      
      {/* PM Filter */}
      <TableHead className="p-1">
        <Select
          value={filters.pm || 'all'}
          onValueChange={(value) => onFilterChange('pm', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="PM..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {managers.map((manager) => (
              <SelectItem key={manager} value={manager}>
                {manager}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      
      {/* Status Filter */}
      <TableHead className="p-1">
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) => onFilterChange('status', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Status..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      
      {/* Country Filter */}
      <TableHead className="p-1">
        <Select
          value={filters.country || 'all'}
          onValueChange={(value) => onFilterChange('country', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Country..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      
      {/* Department Filter */}
      <TableHead className="p-1">
        <Select
          value={filters.department || 'all'}
          onValueChange={(value) => onFilterChange('department', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Dept..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      
      {/* Stage Filter */}
      <TableHead className="p-1">
        <Select
          value={filters.stage || 'all'}
          onValueChange={(value) => onFilterChange('stage', value === 'all' ? '' : value)}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Stage..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {stages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableHead>
      
      {editMode && (
        <TableHead className="w-24 p-1">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="h-8 text-xs w-full"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </TableHead>
      )}
    </TableRow>
  );
};
