import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useWeeklyFilterOptions } from './hooks/useWeeklyFilterOptions';
import { 
  Search, X, ChevronLeft, ChevronRight,
  Users, FolderOpen, Calendar
} from 'lucide-react';

type SortType = 'sector' | 'department' | 'location';

interface WeeklyFilterRowProps {
  filters: {
    sector: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
}

export const WeeklyFilterRow: React.FC<WeeklyFilterRowProps> = ({
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeSortType, setActiveSortType] = useState<SortType>('sector');
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const badgeContainerRef = useRef<HTMLDivElement>(null);
  const { sectors, departments, locations } = useWeeklyFilterOptions();

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

  // Get current sort options based on active sort type
  const getCurrentOptions = () => {
    switch (activeSortType) {
      case 'sector':
        return sectors.map(s => ({ value: s.name, label: s.name, icon: s.icon }));
      case 'department':
        return departments.map(d => ({ value: d.name, label: d.name, icon: d.icon }));
      case 'location':
        return locations.map(l => ({ value: l.code, label: `${l.code} - ${l.city}`, icon: l.emoji }));
      default:
        return [];
    }
  };

  const currentOptions = getCurrentOptions();
  const currentValue = filters[activeSortType];

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
    <div className="flex gap-2 items-center border-x border-b-0 bg-card p-3">
      {/* Sort Type Icon Dropdown */}
      <Select value={activeSortType} onValueChange={(value: any) => setActiveSortType(value)}>
        <SelectTrigger className="w-9 h-9 p-0 border-input">
          <div className="flex items-center justify-center w-full">
            {activeSortType === 'sector' ? (
              <FolderOpen className="h-4 w-4" />
            ) : activeSortType === 'department' ? (
              <Users className="h-4 w-4" />
            ) : (
              <Calendar className="h-4 w-4" />
            )}
          </div>
        </SelectTrigger>
        <SelectContent className="bg-background z-50">
          <SelectItem value="sector">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              <span>Sector</span>
            </div>
          </SelectItem>
          <SelectItem value="department">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Department</span>
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
          onClick={() => onFilterChange(activeSortType, 'all')}
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
            onClick={() => onFilterChange(activeSortType, option.value)}
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
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, project, or location..."
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
  );
};
