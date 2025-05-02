
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from '@/hooks/useProjects';

interface ResourceFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    startDate: Date;
    weeksToShow: number;
  };
  onFilterChange: (filters: Partial<ResourceFiltersProps['filters']>) => void;
}

export const ResourceFilters: React.FC<ResourceFiltersProps> = ({ 
  filters, 
  onFilterChange 
}) => {
  const { projects } = useProjects();
  
  // Extract unique values for filters
  const offices = [...new Set(projects.map(p => p.office?.name).filter(Boolean))];
  const countries = [...new Set(projects.map(p => p.country).filter(Boolean))];
  
  // Get unique project managers
  const managers = projects.reduce((acc, project) => {
    if (project.project_manager && !acc.some(m => m.id === project.project_manager.id)) {
      acc.push({
        id: project.project_manager.id,
        name: `${project.project_manager.first_name || ''} ${project.project_manager.last_name || ''}`.trim()
      });
    }
    return acc;
  }, [] as Array<{id: string, name: string}>);
  
  const handleWeeksToShow = (value: string) => {
    onFilterChange({ weeksToShow: parseInt(value, 10) });
  };

  return (
    <div className="flex flex-wrap gap-4">
      <Select 
        onValueChange={(value) => onFilterChange({ office: value })}
        value={filters.office}
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

      <Select 
        onValueChange={(value) => onFilterChange({ country: value })}
        value={filters.country}
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
        onValueChange={(value) => onFilterChange({ manager: value })}
        value={filters.manager}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Filter by Project Manager" />
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
      
      <Select 
        onValueChange={handleWeeksToShow}
        value={filters.weeksToShow.toString()}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Weeks to show" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4 Weeks</SelectItem>
          <SelectItem value="8">8 Weeks</SelectItem>
          <SelectItem value="12">12 Weeks</SelectItem>
          <SelectItem value="16">16 Weeks</SelectItem>
          <SelectItem value="26">26 Weeks (6 Months)</SelectItem>
          <SelectItem value="52">52 Weeks (1 Year)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
