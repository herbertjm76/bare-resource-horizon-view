
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChevronLeft, ChevronRight, Calendar, Search, X } from 'lucide-react';
import { addWeeks, subWeeks } from 'date-fns';

interface WeekResourceControlsProps {
  selectedWeek: Date;
  setSelectedWeek: (date: Date) => void;
  weekLabel: string;
  filters: {
    office: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export const WeekResourceControls: React.FC<WeekResourceControlsProps> = ({
  selectedWeek,
  setSelectedWeek,
  weekLabel,
  filters,
  onFilterChange
}) => {
  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek(addWeeks(selectedWeek, 1));
  };

  const handleClearSearch = () => {
    onFilterChange('searchTerm', '');
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      {/* Week selector */}
      <div className="flex border rounded-md p-2 items-center shadow-sm">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handlePreviousWeek} 
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        
        <div className="flex items-center mx-2 space-x-1">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{weekLabel}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleNextWeek}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      
      {/* Office filter */}
      <div className="flex-1 max-w-xs">
        <Select 
          value={filters.office} 
          onValueChange={(value) => onFilterChange('office', value)}
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
            <SelectItem value="london">London</SelectItem>
            <SelectItem value="new_york">New York</SelectItem>
            <SelectItem value="singapore">Singapore</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Search filter */}
      <div className="flex-1 max-w-xs relative">
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        
        <Input
          placeholder="Search projects..."
          className="pl-8 pr-8 h-10"
          value={filters.searchTerm}
          onChange={(e) => onFilterChange('searchTerm', e.target.value)}
        />
        
        {filters.searchTerm && (
          <button 
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={handleClearSearch}
            type="button"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </button>
        )}
      </div>
    </div>
  );
};
