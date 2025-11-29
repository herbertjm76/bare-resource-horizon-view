
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from '@/hooks/useProjects';

export const ProjectFilters = ({ 
  onFilterChange,
  currentFilters 
}: { 
  onFilterChange: (filters: { [key: string]: string }) => void;
  currentFilters: { [key: string]: string };
}) => {
  const { projects } = useProjects();

  // Extract unique values for filters
  const statuses = [...new Set(projects.map(p => p.status))];
  const countries = [...new Set(projects.map(p => p.country).filter(Boolean))];
  const offices = [...new Set(projects.map(p => p.office?.name).filter(Boolean))];

  const handleFilterChange = (value: string, filterKey: string) => {
    // Create a new filters object with the updated value
    const newFilters = {
      ...currentFilters,
      [filterKey]: value === "all" ? "" : value
    };
    // Pass the complete new filters object to the parent
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select 
        onValueChange={(value) => handleFilterChange(value, 'status')}
        value={currentFilters.status || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status === 'In Progress' || status === 'Planning' ? 'Active' : status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        onValueChange={(value) => handleFilterChange(value, 'country')}
        value={currentFilters.country || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Country" />
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

      <Select 
        onValueChange={(value) => handleFilterChange(value, 'office')}
        value={currentFilters.office || "all"}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Office" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Offices</SelectItem>
          {offices.map((office) => (
            <SelectItem key={office} value={office}>
              {office}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
