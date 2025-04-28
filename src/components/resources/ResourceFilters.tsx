
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { addWeeks, subWeeks } from 'date-fns';
import { useProjects } from '@/hooks/useProjects';

interface ResourceFiltersProps {
  filters: {
    office: string;
    country: string;
    manager: string;
    startDate: Date;
    weeksToShow: number;
  };
  onFilterChange: (filters: Partial<typeof ResourceFiltersProps.prototype.filters>) => void;
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
  
  const handlePreviousWeek = () => {
    onFilterChange({ startDate: subWeeks(filters.startDate, 1) });
  };
  
  const handleNextWeek = () => {
    onFilterChange({ startDate: addWeeks(filters.startDate, 1) });
  };
  
  const handleWeeksToShow = (value: string) => {
    onFilterChange({ weeksToShow: parseInt(value, 10) });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select 
        onValueChange={(value) => onFilterChange({ office: value })}
        value={filters.office}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Office" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Offices</SelectItem>
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
          <SelectItem value="">All Countries</SelectItem>
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
          <SelectItem value="">All Project Managers</SelectItem>
          {managers.map((manager) => (
            <SelectItem key={manager.id} value={manager.id}>
              {manager.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <div className="flex items-center ml-auto space-x-2">
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
          </SelectContent>
        </Select>
        
        <div className="flex items-center border rounded-md">
          <Button variant="ghost" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="flex items-center px-2">
            <Calendar className="h-4 w-4 mr-2" />
          </span>
          <Button variant="ghost" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
