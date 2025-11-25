import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { useWeeklyFilterOptions } from './hooks/useWeeklyFilterOptions';
import { 
  Search, X, Expand, Minimize2, Calendar, 
  PlayCircle, PauseCircle, Maximize, Minimize,
  Users, FolderOpen, LayoutGrid, Presentation, Table as TableIcon,
  ChevronLeft, ChevronRight
} from 'lucide-react';

export type ViewType = 'table' | 'grid' | 'carousel';
export type RundownMode = 'people' | 'projects';
export type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';
export type TableOrientation = 'per-person' | 'per-project';

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
    sector: string;
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
  const [activeSortType, setActiveSortType] = useState<'sector' | 'department' | 'location'>('sector');
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

  // Debug logging
  console.log('Filter Options Debug:', {
    activeSortType,
    sectors,
    departments,
    locations,
    sectorsCount: sectors?.length,
    departmentsCount: departments?.length,
    locationsCount: locations?.length
  });

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

  console.log('Current Options Debug:', {
    activeSortType,
    currentOptionsCount: currentOptions?.length,
    currentOptions,
    currentValue
  });

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
  const showSortOptions = viewType !== 'table';
  const showCompactExpanded = viewType === 'table';
  const showTableOrientation = viewType === 'table';
  const showAutoAdvance = viewType === 'carousel';
  const showProgress = viewType === 'carousel' && totalItems && totalItems > 0;

  return (
    <div className="space-y-4 unified-weekly-controls">
      {/* Main Controls Row */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center bg-card rounded-t-lg border border-b-0 p-3">
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
            <Button
              variant={viewType === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('table')}
              className={`flex items-center h-7 px-2 ${viewType === 'table' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
            >
              <TableIcon className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewType === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('grid')}
              className={`flex items-center h-7 px-2 ${viewType === 'grid' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewType === 'carousel' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewTypeChange('carousel')}
              className={`flex items-center h-7 px-2 ${viewType === 'carousel' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
            >
              <Presentation className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* People/Projects Toggle - Grid & Carousel only */}
          {showPeopleProjectToggle && rundownMode && onModeChange && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Button
                variant={rundownMode === 'people' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('people')}
                className={`flex items-center h-7 px-2 ${rundownMode === 'people' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <Users className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={rundownMode === 'projects' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onModeChange('projects')}
                className={`flex items-center h-7 px-2 ${rundownMode === 'projects' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Table Orientation Toggle - Only for table view */}
          {showTableOrientation && onTableOrientationChange && tableOrientation && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Button
                variant={tableOrientation === 'per-person' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTableOrientationChange('per-person')}
                className={`flex items-center h-7 px-2 ${tableOrientation === 'per-person' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <Users className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={tableOrientation === 'per-project' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTableOrientationChange('per-project')}
                className={`flex items-center h-7 px-2 ${tableOrientation === 'per-project' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <FolderOpen className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Compact/Expanded Toggle - Table only */}
          {showCompactExpanded && viewMode && onViewModeChange && (
            <div className="flex rounded-lg border p-1 bg-muted">
              <Button
                variant={viewMode === 'compact' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('compact')}
                className={`flex items-center h-7 px-2 ${viewMode === 'compact' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <Minimize2 className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant={viewMode === 'expanded' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('expanded')}
                className={`flex items-center h-7 px-2 ${viewMode === 'expanded' ? 'bg-gradient-modern text-white hover:opacity-90' : ''}`}
              >
                <Expand className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}

          {/* Sort Options - Grid & Carousel only */}
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
          )}

          {/* Fullscreen - Hidden on mobile */}
          {typeof window !== 'undefined' &&
            window.innerWidth >= 768 &&
            isFullscreen !== undefined &&
            onFullscreenToggle && (
              <Button
                variant="outline"
                size="sm"
                onClick={onFullscreenToggle}
                className="h-7 px-2"
              >
                {isFullscreen ? (
                  <Minimize className="h-3.5 w-3.5" />
                ) : (
                  <Maximize className="h-3.5 w-3.5" />
                )}
              </Button>
            )}

        </div>
      </div>
    </div>
  );
};
