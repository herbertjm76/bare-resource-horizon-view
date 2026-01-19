import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from 'lucide-react';

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
  managers
}) => {
  return (
    <TableRow className="bg-muted/30 hover:bg-muted/30">
      {editMode && <TableCell className="p-1" />}
      <TableCell className="p-1">
        <Input
          placeholder="Code..."
          value={filters.code || ''}
          onChange={(e) => onFilterChange('code', e.target.value)}
          className="h-7 text-xs"
        />
      </TableCell>
      <TableCell className="p-1">
        <Input
          placeholder="Abbrev..."
          value={filters.abbreviation || ''}
          onChange={(e) => onFilterChange('abbreviation', e.target.value)}
          className="h-7 text-xs"
        />
      </TableCell>
      <TableCell className="p-1">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            value={filters.name || ''}
            onChange={(e) => onFilterChange('name', e.target.value)}
            className="h-7 text-xs pl-7"
          />
        </div>
      </TableCell>
      <TableCell className="p-1">
        <Select
          value={filters.pm || "all"}
          onValueChange={(value) => onFilterChange('pm', value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="All PMs" />
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
      </TableCell>
      <TableCell className="p-1">
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => onFilterChange('status', value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="All" />
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
      </TableCell>
      <TableCell className="p-1">
        <Select
          value={filters.country || "all"}
          onValueChange={(value) => onFilterChange('country', value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="All" />
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
      </TableCell>
      <TableCell className="p-1">
        <Select
          value={filters.department || "all"}
          onValueChange={(value) => onFilterChange('department', value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="All" />
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
      </TableCell>
      <TableCell className="p-1">
        <Select
          value={filters.stage || "all"}
          onValueChange={(value) => onFilterChange('stage', value === "all" ? "" : value)}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue placeholder="All" />
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
      </TableCell>
      {editMode && <TableCell className="p-1" />}
    </TableRow>
  );
};
