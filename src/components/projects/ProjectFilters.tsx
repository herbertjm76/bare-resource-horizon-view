
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from '@/hooks/useProjects';

type FilterOption = {
  label: string;
  value: string;
};

export const ProjectFilters = ({ 
  onFilterChange 
}: { 
  onFilterChange: (filters: { [key: string]: string }) => void;
}) => {
  const { projects } = useProjects();

  // Extract unique values for filters
  const statuses = [...new Set(projects.map(p => p.status))];
  const stages = [...new Set(projects.map(p => p.current_stage))];
  const countries = [...new Set(projects.map(p => p.country))];

  const handleFilterChange = (value: string, filterKey: string) => {
    onFilterChange(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select onValueChange={(value) => handleFilterChange(value, 'status')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleFilterChange(value, 'stage')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Stage" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Stages</SelectItem>
          {stages.map((stage) => (
            <SelectItem key={stage} value={stage}>
              {stage}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => handleFilterChange(value, 'country')}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Country" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
