import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useWeeklyFilterOptions } from '@/components/week-resourcing/hooks/useWeeklyFilterOptions';
import { 
  Search, X, Users, FolderOpen, MapPin, ChevronLeft, ChevronRight
} from 'lucide-react';

interface MemberFilterRowProps {
  filters: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  searchLabel?: string;
  searchPlaceholder?: string;
  hideSearch?: boolean;
  // Optional external search (e.g., for project search)
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
}

type FilterType = 'practiceArea' | 'department' | 'location';

export const MemberFilterRow: React.FC<MemberFilterRowProps> = ({
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters,
  searchLabel = 'Search',
  searchPlaceholder = 'Search...',
  hideSearch = false,
  searchTerm: externalSearchTerm,
  onSearchChange: externalOnSearchChange
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Use external search if provided, otherwise use filters.searchTerm
  const searchValue = externalSearchTerm !== undefined ? externalSearchTerm : filters.searchTerm;
  const handleSearchChange = externalOnSearchChange || ((value: string) => onFilterChange('searchTerm', value));
  
  // Determine initial filter type based on which filter is set
  const getInitialFilterType = (): FilterType => {
    if (filters.practiceArea && filters.practiceArea !== 'all') return 'practiceArea';
    if (filters.department && filters.department !== 'all') return 'department';
    if (filters.location && filters.location !== 'all') return 'location';
    return 'practiceArea'; // Default to practice area
  };
  
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(getInitialFilterType);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const badgeContainerRef = useRef<HTMLDivElement>(null);
  const { practiceAreas, departments, locations } = useWeeklyFilterOptions();

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
    <div className="flex gap-2 items-center px-2 pb-2">
      {/* Filter Type Icon Dropdown */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select value={activeFilterType} onValueChange={(value: FilterType) => setActiveFilterType(value)}>
              <SelectTrigger className="w-9 h-9 p-0 border-input bg-background">
                <div className="flex items-center justify-center w-full">
                  {activeFilterType === 'practiceArea' ? (
                    <FolderOpen className="h-4 w-4" />
                  ) : activeFilterType === 'department' ? (
                    <Users className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
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
              <MapPin className="h-4 w-4" />
              <span>Location</span>
            </div>
          </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Filter by {activeFilterType === 'practiceArea' ? 'Practice Area' : activeFilterType === 'department' ? 'Department' : 'Location'}</p>
        </TooltipContent>
      </Tooltip>

      {/* Badges Container */}
      <div 
        ref={badgeContainerRef}
        className="flex gap-2 overflow-x-auto flex-1 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <Badge
          variant={currentValue === 'all' ? 'default' : 'outline'}
          className={`cursor-pointer whitespace-nowrap transition-all ${
            currentValue === 'all' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent'
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
              currentValue === option.value ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent'
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 shrink-0"
              onClick={() => scrollBadges('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Scroll left</p></TooltipContent>
        </Tooltip>
      )}
      {canScrollRight && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 shrink-0"
              onClick={() => scrollBadges('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Scroll right</p></TooltipContent>
        </Tooltip>
      )}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 w-9 p-0 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent><p>Clear filters</p></TooltipContent>
        </Tooltip>
      )}

      {/* Search Icon Button */}
      {!hideSearch && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={`h-9 w-9 p-0 shrink-0 relative ${filters.searchTerm ? 'ring-2 ring-primary' : ''}`}
                  >
                    <Search className="h-4 w-4" />
                    {searchValue && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-4 bg-background z-50" align="end">
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{searchLabel}</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={searchValue}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="pl-9"
                        autoFocus
                      />
                      {searchValue && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 h-7 w-7 p-0 -translate-y-1/2"
                          onClick={() => handleSearchChange('')}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </TooltipTrigger>
          <TooltipContent><p>{searchLabel}</p></TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};
