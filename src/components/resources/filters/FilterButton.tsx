
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick?: () => void;
  className?: string;
  filterContent?: React.ReactNode; // Added filterContent prop
  onClearFilters?: () => void; // Added onClearFilters prop
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeFiltersCount,
  onClick,
  className,
  filterContent,
  onClearFilters
}) => {
  const [open, setOpen] = useState(false);

  // If filterContent is provided, use Popover, otherwise just a button
  if (filterContent) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="default" 
            className={`flex items-center bg-brand-primary hover:bg-brand-primary/90 ${className || ''}`}
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
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="p-4">
            {filterContent}
            {activeFiltersCount > 0 && onClearFilters && (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => {
                  onClearFilters();
                  setOpen(false);
                }}
              >
                Clear All Filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

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
