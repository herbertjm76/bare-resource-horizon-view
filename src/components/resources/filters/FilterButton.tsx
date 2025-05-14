
import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick?: () => void;
  className?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeFiltersCount,
  onClick,
  className
}) => {
  return (
    <Button 
      variant="default" 
      className={`flex items-center bg-brand-primary hover:bg-brand-primary/90 ${className || ''}`}
      onClick={onClick}
      type="button"
    >
      <Filter className="w-4 h-4 mr-2" />
      <span>Filters</span>
      {activeFiltersCount > 0 && (
        <Badge 
          className="ml-2 bg-white text-brand-primary hover:bg-white" 
          variant="outline"
        >
          {activeFiltersCount}
        </Badge>
      )}
    </Button>
  );
};
