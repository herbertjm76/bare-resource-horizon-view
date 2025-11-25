import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TeamMembersFiltersProps {
  filters: {
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

export const TeamMembersFilters: React.FC<TeamMembersFiltersProps> = ({
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<'department' | 'location'>('department');
  const [focusedBadgeIndex, setFocusedBadgeIndex] = useState(0);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Fetch departments
  const { data: departments = [] } = useQuery({
    queryKey: ['office-departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_departments')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch locations
  const { data: locations = [] } = useQuery({
    queryKey: ['office-locations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_locations')
        .select('*')
        .order('city');
      if (error) throw error;
      return data || [];
    }
  });

  // Get current filter options based on active filter type
  const getCurrentOptions = () => {
    switch (activeFilterType) {
      case 'department':
        return departments.map(d => ({ value: d.name, label: d.name, icon: d.icon }));
      case 'location':
        return locations.map(l => ({ value: l.code, label: `${l.code} - ${l.city}`, icon: l.emoji }));
      default:
        return [];
    }
  };

  const currentOptions = getCurrentOptions();
  const currentValue = filters[activeFilterType];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentOptions.length === 0) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedBadgeIndex(prev => (prev > 0 ? prev - 1 : currentOptions.length - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedBadgeIndex(prev => (prev < currentOptions.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'Enter' && focusedBadgeIndex >= 0) {
        e.preventDefault();
        onFilterChange(activeFilterType, currentOptions[focusedBadgeIndex].value);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentOptions, focusedBadgeIndex, activeFilterType, onFilterChange]);

  // Scroll focused badge into view
  useEffect(() => {
    if (badgeContainerRef.current) {
      const badges = badgeContainerRef.current.querySelectorAll('[data-badge-index]');
      const focusedBadge = badges[focusedBadgeIndex] as HTMLElement;
      if (focusedBadge) {
        focusedBadge.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [focusedBadgeIndex]);

  // Reset focused index when filter type changes
  useEffect(() => {
    setFocusedBadgeIndex(0);
  }, [activeFilterType]);

  return (
    <div className="space-y-3 mb-4">
      <div className="flex gap-3 items-center flex-wrap">
        {/* Filter Type Selector */}
        <Select value={activeFilterType} onValueChange={(value: any) => setActiveFilterType(value)}>
          <SelectTrigger className="w-44 h-9">
            <SelectValue placeholder="Filter by..." />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="department">Filter by Department</SelectItem>
            <SelectItem value="location">Filter by Location</SelectItem>
          </SelectContent>
        </Select>

        {/* Navigation Arrows */}
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setFocusedBadgeIndex(prev => (prev > 0 ? prev - 1 : currentOptions.length - 1))}
            disabled={currentOptions.length === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => setFocusedBadgeIndex(prev => (prev < currentOptions.length - 1 ? prev + 1 : 0))}
            disabled={currentOptions.length === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-2" />
            Clear
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}

        {/* Search Button/Popover */}
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 gap-2 ml-auto"
            >
              <Search className="h-4 w-4" />
              Search
              {filters.searchTerm && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5">
                  1
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4 bg-background z-50" align="end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Team Members</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or job title..."
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                  className="pl-10"
                  autoFocus
                />
                {filters.searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                    onClick={() => onFilterChange('searchTerm', '')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Horizontal Badge Carousel - Filter Options */}
      <div 
        ref={badgeContainerRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {/* All option */}
        <Badge
          data-badge-index="-1"
          variant={currentValue === 'all' ? 'default' : 'outline'}
          className={`cursor-pointer whitespace-nowrap transition-all ${
            focusedBadgeIndex === -1 ? 'ring-2 ring-primary' : ''
          } ${currentValue === 'all' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
          onClick={() => onFilterChange(activeFilterType, 'all')}
        >
          All
        </Badge>

        {/* Dynamic filter options */}
        {currentOptions.map((option, index) => (
          <Badge
            key={option.value}
            data-badge-index={index}
            variant={currentValue === option.value ? 'default' : 'outline'}
            className={`cursor-pointer whitespace-nowrap transition-all ${
              focusedBadgeIndex === index ? 'ring-2 ring-primary' : ''
            } ${currentValue === option.value ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
            onClick={() => onFilterChange(activeFilterType, option.value)}
          >
            {option.icon && <span className="mr-1">{option.icon}</span>}
            {option.label}
          </Badge>
        ))}
      </div>
    </div>
  );
};
