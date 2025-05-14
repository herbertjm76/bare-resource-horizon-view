
import React, { ReactNode } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FilterButton } from '@/components/resources/filters/FilterButton';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface FilterPopoverProps {
  activeFiltersCount: number;
  children: ReactNode;
  onClearFilters?: () => void;
  align?: 'start' | 'center' | 'end';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export const FilterPopover: React.FC<FilterPopoverProps> = ({
  activeFiltersCount,
  children,
  onClearFilters,
  align = 'start',
  side = 'bottom'
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <FilterButton activeFiltersCount={activeFiltersCount} />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto min-w-[320px] p-0 shadow-md" 
        align={align}
        side={side}
        sideOffset={4}
      >
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <h3 className="font-medium">Filters</h3>
          {activeFiltersCount > 0 && onClearFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs h-7 px-2"
              onClick={onClearFilters}
            >
              <X className="w-3 h-3 mr-1" />
              Clear all filters
            </Button>
          )}
        </div>
        
        <div className="p-4 border-t">
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};
