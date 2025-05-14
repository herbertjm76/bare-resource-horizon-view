
import React from 'react';
import { X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FilterBadgesProps {
  filters: {
    office: string;
    country: string;
    manager: string;
  };
  onFilterChange: (key: string, value: string) => void;
  managerOptions: {id: string, name: string}[];
  officeOptions?: string[];
  countryOptions?: string[];
}

export const FilterBadges: React.FC<FilterBadgesProps> = ({
  filters,
  onFilterChange,
  managerOptions,
  officeOptions,
  countryOptions
}) => {
  // Count active filters
  const activeFiltersCount = 
    (filters.office !== 'all' ? 1 : 0) + 
    (filters.country !== 'all' ? 1 : 0) + 
    (filters.manager !== 'all' ? 1 : 0);

  if (activeFiltersCount === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2">
      {filters.office !== 'all' && (
        <Badge 
          variant="outline" 
          className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
        >
          Office: {filters.office}
          <Button 
            variant="ghost"
            size="sm"
            className="ml-1 p-0 h-auto hover:bg-transparent hover:text-destructive"
            onClick={() => onFilterChange('office', 'all')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.country !== 'all' && (
        <Badge 
          variant="outline" 
          className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
        >
          Country: {filters.country}
          <Button 
            variant="ghost"
            size="sm"
            className="ml-1 p-0 h-auto hover:bg-transparent hover:text-destructive"
            onClick={() => onFilterChange('country', 'all')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
      {filters.manager !== 'all' && (
        <Badge 
          variant="outline" 
          className="bg-slate-50 hover:bg-slate-100 text-xs py-0 h-6"
        >
          Manager: {managerOptions.find(m => m.id === filters.manager)?.name || filters.manager}
          <Button 
            variant="ghost"
            size="sm"
            className="ml-1 p-0 h-auto hover:bg-transparent hover:text-destructive"
            onClick={() => onFilterChange('manager', 'all')}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  );
};
