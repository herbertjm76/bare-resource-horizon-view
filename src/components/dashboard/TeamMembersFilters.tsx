import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, X, ChevronLeft, ChevronRight, Users, Calendar, FolderOpen, ArrowUpDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TeamMembersFiltersProps {
  filters: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  sortBy: 'name' | 'created_date' | 'none';
  sortDirection: 'asc' | 'desc';
  onSortChange: (value: 'name' | 'created_date' | 'none') => void;
  onSortDirectionChange: (value: 'asc' | 'desc') => void;
}

export const TeamMembersFilters: React.FC<TeamMembersFiltersProps> = ({
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters,
  sortBy,
  sortDirection,
  onSortChange,
  onSortDirectionChange
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState<'practiceArea' | 'department' | 'location'>('department');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const badgeContainerRef = useRef<HTMLDivElement>(null);

  // Check scroll position
  const checkScroll = useCallback(() => {
    if (badgeContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = badgeContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  // Scroll badges
  const scrollBadges = useCallback((direction: 'left' | 'right') => {
    if (badgeContainerRef.current) {
      const scrollAmount = 200;
      badgeContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  // Fetch practice areas
  const { data: practiceAreas = [] } = useQuery({
    queryKey: ['office-practice-areas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('office_practice_areas')
        .select('*')
        .order('name');
      if (error) throw error;
      return data || [];
    }
  });

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
      case 'practiceArea':
        return practiceAreas.map(pa => ({ value: pa.name, label: pa.name, icon: pa.icon }));
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

  // Setup scroll listeners
  useEffect(() => {
    checkScroll();
    const container = badgeContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [checkScroll]);

  // Check scroll when options change
  useEffect(() => {
    checkScroll();
  }, [currentOptions.length, checkScroll]);


  return (
    <div className="space-y-3 mb-4">
      {/* Streamlined Single Row Filter */}
      <div className="flex gap-2 items-center">
        {/* Filter Type Icon Dropdown */}
        <Select value={activeFilterType} onValueChange={(value: any) => setActiveFilterType(value)}>
          <SelectTrigger className="w-9 h-9 p-0 border-input">
            <div className="flex items-center justify-center w-full">
              {activeFilterType === 'practiceArea' ? (
                <FolderOpen className="h-4 w-4" />
              ) : activeFilterType === 'department' ? (
                <Users className="h-4 w-4" />
              ) : (
                <Calendar className="h-4 w-4" />
              )}
            </div>
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            <SelectItem value="department">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>Department</span>
              </div>
            </SelectItem>
            <SelectItem value="practiceArea">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                <span>Practice Area</span>
              </div>
            </SelectItem>
            <SelectItem value="location">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Location</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Badges Container */}
        <div 
          ref={badgeContainerRef}
          className="flex gap-2 overflow-x-auto flex-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Badge
            variant={currentValue === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer whitespace-nowrap transition-all ${
              currentValue === 'all' ? 'bg-gradient-modern text-white hover:opacity-90' : ''
            }`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFilterChange(activeFilterType, 'all');
            }}
          >
            All
          </Badge>

          {currentOptions.map((option) => (
            <Badge
              key={option.value}
              variant={currentValue === option.value ? 'default' : 'outline'}
              className={`cursor-pointer whitespace-nowrap transition-all ${
                currentValue === option.value ? 'bg-gradient-modern text-white hover:opacity-90' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFilterChange(activeFilterType, option.value);
              }}
            >
              {option.label}
            </Badge>
          ))}
        </div>

        {/* Badge Scroll Arrows */}
        {canScrollLeft && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => scrollBadges('left')}
            title="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => scrollBadges('right')}
            title="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9 w-9 p-0 shrink-0"
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {/* Sort Dropdown with Visual Indicator */}
        <div className="flex items-center gap-1">
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className={`w-auto h-9 shrink-0 ${sortBy !== 'none' ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">
                  {sortBy === 'created_date' ? 'Created Date' : sortBy === 'name' ? 'Name' : 'Sort'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="none">No sorting</SelectItem>
              <SelectItem value="created_date">Created Date</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Sort Indicator Badge */}
          {sortBy === 'name' && (
            <Badge 
              variant="default" 
              className="bg-gradient-modern text-white text-xs px-2 py-0.5 h-6"
            >
              {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
            </Badge>
          )}
          {sortBy === 'created_date' && (
            <Badge 
              variant="default" 
              className="bg-gradient-modern text-white text-xs px-2 py-0.5 h-6"
            >
              {sortDirection === 'asc' ? 'Old→New' : 'New→Old'}
            </Badge>
          )}
        </div>

        {/* Sort Direction Toggle (only show when sorting is active) */}
        {sortBy !== 'none' && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0 shrink-0"
            onClick={() => onSortDirectionChange(sortDirection === 'asc' ? 'desc' : 'asc')}
            title={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </Button>
        )}

        {/* Search Icon Button */}
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={`h-9 w-9 p-0 shrink-0 relative ${filters.searchTerm ? 'ring-2 ring-primary' : ''}`}
              title="Search"
            >
              <Search className="h-4 w-4" />
              {filters.searchTerm && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
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
    </div>
  );
};
