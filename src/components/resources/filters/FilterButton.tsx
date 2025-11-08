
import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { StandardizedBadge } from "@/components/ui/standardized-badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterButtonProps {
  activeFiltersCount: number;
  onClick?: () => void;
  className?: string;
  filterContent?: React.ReactNode;
  onClearFilters?: () => void;
  buttonText?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  activeFiltersCount,
  onClick,
  className,
  filterContent,
  onClearFilters,
  buttonText = "Filters"
}) => {
  const [open, setOpen] = useState(false);

  // If filterContent is provided, use Popover, otherwise just a button
  if (filterContent) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex items-center px-3 ${className || ''}`}
            type="button"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span>{buttonText}</span>
            {activeFiltersCount > 0 && (
              <StandardizedBadge variant="primary" size="sm" className="ml-2">
                {activeFiltersCount}
              </StandardizedBadge>
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
                Reset All Filters
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Button 
      variant="outline" 
      className={`flex items-center ${className || ''}`}
      onClick={onClick}
      type="button"
    >
      <Filter className="h-4 w-4 mr-2" />
      <span>{buttonText}</span>
      {activeFiltersCount > 0 && (
        <StandardizedBadge variant="primary" size="sm" className="ml-2">
          {activeFiltersCount}
        </StandardizedBadge>
      )}
    </Button>
  );
};
