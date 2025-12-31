import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { useWeeklyFilterOptions } from '@/components/week-resourcing/hooks/useWeeklyFilterOptions';
import { 
  Expand, Minimize2, Calendar, 
  PlayCircle, PauseCircle,
  Users, FolderOpen, LayoutGrid, Presentation, Table as TableIcon,
  MapPin, Search, X, ChevronLeft, ChevronRight
} from 'lucide-react';

export type ViewType = 'table' | 'grid' | 'carousel';
export type RundownMode = 'people' | 'projects';
export type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';
export type TableOrientation = 'per-person' | 'per-project';

type FilterType = 'practiceArea' | 'department' | 'location';

interface UnifiedWeeklyControlsProps {
  // Week selection
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
  weekLabel: string;
  
  // View type
  viewType: ViewType;
  onViewTypeChange: (view: ViewType) => void;
  
  // Filters
  filters: {
    practiceArea: string;
    department: string;
    location: string;
    searchTerm: string;
  };
  onFilterChange: (key: string, value: string) => void;
  activeFiltersCount: number;
  clearFilters: () => void;
  
  // Table-specific
  viewMode?: 'compact' | 'expanded';
  onViewModeChange?: (mode: 'compact' | 'expanded') => void;
  tableOrientation?: TableOrientation;
  onTableOrientationChange?: (orientation: TableOrientation) => void;
  
  // Grid/Carousel-specific
  rundownMode?: RundownMode;
  onModeChange?: (mode: RundownMode) => void;
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  
  // Carousel-specific
  isAutoAdvance?: boolean;
  onAutoAdvanceToggle?: () => void;
  currentIndex?: number;
  totalItems?: number;
  
  // Fullscreen
  isFullscreen?: boolean;
  onFullscreenToggle?: () => void;
}

export const UnifiedWeeklyControls: React.FC<UnifiedWeeklyControlsProps> = ({
  selectedWeek,
  onWeekChange,
  weekLabel,
  viewType,
  onViewTypeChange,
  filters,
  onFilterChange,
  activeFiltersCount,
  clearFilters,
  viewMode,
  onViewModeChange,
  tableOrientation,
  onTableOrientationChange,
  rundownMode,
  onModeChange,
  sortOption,
  onSortChange,
  isAutoAdvance,
  onAutoAdvanceToggle,
  currentIndex,
  totalItems,
  isFullscreen,
  onFullscreenToggle
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const badgeContainerRef = useRef<HTMLDivElement>(null);
  const { practiceAreas, departments, locations } = useWeeklyFilterOptions();

  // Determine initial filter type based on which filter is set
  const getInitialFilterType = (): FilterType => {
    if (filters.practiceArea && filters.practiceArea !== 'all') return 'practiceArea';
    if (filters.department && filters.department !== 'all') return 'department';
    if (filters.location && filters.location !== 'all') return 'location';
    return 'practiceArea';
  };
  
  const [activeFilterType, setActiveFilterType] = useState<FilterType>(getInitialFilterType);

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
  
  const showPeopleProjectToggle = viewType !== 'table';
  const showSortOptions = true;
  const showCompactExpanded = viewType === 'table';
  const showTableOrientation = viewType === 'table';
  const showAutoAdvance = viewType === 'carousel';
  const showProgress = viewType === 'carousel' && totalItems && totalItems > 0;

  return (
    <div className="unified-weekly-controls mb-4">
      <div className="bg-card rounded-lg border shadow-sm">
        {/* Row 1: Week Selector + View Controls */}
        <div className="flex flex-col lg:flex-row gap-3 lg:items-center p-3">
        {/* Left section - Week and Progress */}
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <WeekStartSelector
              selectedWeek={selectedWeek}
              onWeekChange={onWeekChange}
            />
          </div>
          
          {showProgress && (
            <div className="text-sm text-muted-foreground whitespace-nowrap hidden lg:block">
              {rundownMode === 'people' ? 'Person' : 'Project'} {currentIndex! + 1} of {totalItems}
            </div>
          )}
        </div>

        {/* Right section - View Controls */}
        <div className="flex gap-2 items-center ml-auto overflow-x-auto">
          {/* View Type Toggle */}
          <div className="flex rounded-lg border p-1 bg-muted">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewType === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewTypeChange('table')}
                  className={`flex items-center h-7 px-2 ${viewType === 'table' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                >
                  <TableIcon className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Table View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewTypeChange('grid')}
                  className={`flex items-center h-7 px-2 ${viewType === 'grid' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Grid View</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={viewType === 'carousel' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewTypeChange('carousel')}
                  className={`flex items-center h-7 px-2 ${viewType === 'carousel' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                >
                  <Presentation className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Carousel View</TooltipContent>
            </Tooltip>
          </div>

          {/* People/Projects Toggle - Grid & Carousel only */}
          {showPeopleProjectToggle && rundownMode && onModeChange && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={rundownMode === 'people' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onModeChange('people')}
                    className={`flex items-center h-7 px-2 ${rundownMode === 'people' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View by People</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={rundownMode === 'projects' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onModeChange('projects')}
                    className={`flex items-center h-7 px-2 ${rundownMode === 'projects' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View by Projects</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Table Orientation Toggle - Only for table view */}
          {showTableOrientation && onTableOrientationChange && tableOrientation && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tableOrientation === 'per-person' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onTableOrientationChange('per-person')}
                    className={`flex items-center h-7 px-2 ${tableOrientation === 'per-person' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <Users className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Group by Person</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={tableOrientation === 'per-project' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onTableOrientationChange('per-project')}
                    className={`flex items-center h-7 px-2 ${tableOrientation === 'per-project' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <FolderOpen className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Group by Project</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Compact/Expanded Toggle - Table only */}
          {showCompactExpanded && viewMode && onViewModeChange && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('compact')}
                    className={`flex items-center h-7 px-2 ${viewMode === 'compact' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Compact View</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === 'expanded' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onViewModeChange('expanded')}
                    className={`flex items-center h-7 px-2 ${viewMode === 'expanded' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
                  >
                    <Expand className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Expanded View</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Sort Options */}
          {showSortOptions && sortOption && onSortChange && (
            <Select value={sortOption} onValueChange={onSortChange}>
              <SelectTrigger className="w-28 h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alphabetical">A-Z</SelectItem>
                <SelectItem value="utilization">Utilization</SelectItem>
                <SelectItem value="location">Location</SelectItem>
                <SelectItem value="department">Department</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Auto-advance - Carousel only */}
          {showAutoAdvance && isAutoAdvance !== undefined && onAutoAdvanceToggle && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onAutoAdvanceToggle}
                  className="h-7 px-2"
                >
                  {isAutoAdvance ? (
                    <PauseCircle className="h-3.5 w-3.5" />
                  ) : (
                    <PlayCircle className="h-3.5 w-3.5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isAutoAdvance ? 'Pause Auto-Advance' : 'Start Auto-Advance'}</TooltipContent>
            </Tooltip>
          )}

        </div>
        </div>

        {/* Subtle divider */}
        <div className="border-t border-border/50 mx-3" />

        {/* Row 2: Filter Badges */}
        <div className="flex gap-2 items-center px-3 py-2 bg-muted/30 rounded-b-lg">
        {/* Filter Type Icon Dropdown */}
        <Select value={activeFilterType} onValueChange={(value: FilterType) => setActiveFilterType(value)}>
          <SelectTrigger className="w-8 h-8 p-0 border-input bg-background">
            <div className="flex items-center justify-center w-full">
              {activeFilterType === 'practiceArea' ? (
                <FolderOpen className="h-3.5 w-3.5" />
              ) : activeFilterType === 'department' ? (
                <Users className="h-3.5 w-3.5" />
              ) : (
                <MapPin className="h-3.5 w-3.5" />
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

        {/* Badges Container */}
        <div 
          ref={badgeContainerRef}
          className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <Badge
            variant={currentValue === 'all' ? 'default' : 'outline'}
            className={`cursor-pointer whitespace-nowrap transition-all text-xs h-6 ${
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
              className={`cursor-pointer whitespace-nowrap transition-all text-xs h-6 ${
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={() => scrollBadges('left')}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </Button>
        )}
        {canScrollRight && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 shrink-0"
            onClick={() => scrollBadges('right')}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 w-8 p-0 shrink-0"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Clear Filters</TooltipContent>
          </Tooltip>
        )}

        {/* Search Icon Button */}
        <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`h-8 w-8 p-0 shrink-0 relative ${filters.searchTerm ? 'ring-2 ring-primary' : ''}`}
                >
                  <Search className="h-3.5 w-3.5" />
                  {filters.searchTerm && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-primary rounded-full" />
                  )}
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent>Search</TooltipContent>
          </Tooltip>
          <PopoverContent className="w-80 p-4 bg-background z-50" align="end">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Search Members</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.searchTerm}
                  onChange={(e) => onFilterChange('searchTerm', e.target.value)}
                  placeholder="Search by name..."
                  className="pl-9"
                  autoFocus
                />
                {filters.searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-7 w-7 p-0 -translate-y-1/2"
                    onClick={() => onFilterChange('searchTerm', '')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        </div>
      </div>
    </div>
  );
};
