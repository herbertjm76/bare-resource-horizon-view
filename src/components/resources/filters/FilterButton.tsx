
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterButtonProps {
  activeFiltersCount: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeFiltersCount
}) => {
  return (
    <Button 
      variant="outline" 
      className="flex items-center border-slate-200 bg-white hover:bg-slate-100"
    >
      <Filter className="w-4 h-4 mr-2 text-brand-primary" />
      <span>Filters</span>
      {activeFiltersCount > 0 && (
        <Badge 
          className="ml-2 bg-brand-primary hover:bg-brand-primary" 
          variant="secondary"
        >
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
};
