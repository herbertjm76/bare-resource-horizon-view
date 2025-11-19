import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { WeekStartSelector } from '@/components/workload/WeekStartSelector';
import { 
  Search, X, Expand, Minimize2, Calendar, 
  PlayCircle, PauseCircle, Maximize, Minimize,
  Users, FolderOpen, LayoutGrid, Presentation, Table as TableIcon
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
    office: string;
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
  const showPeopleProjectToggle = viewType !== 'table';
  const showSortOptions = viewType !== 'table';
  const showCompactExpanded = viewType === 'table';
  const showTableOrientation = viewType === 'table';
  const showAutoAdvance = viewType === 'carousel';
  const showProgress = viewType === 'carousel' && totalItems && totalItems > 0;

  return (
    <div className="space-y-4">
      {/* Main Controls Row */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center bg-card rounded-lg border p-3">
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

          {/* Fullscreen */}
          {isFullscreen !== undefined && onFullscreenToggle && (
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

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              tableOrientation === 'per-project' 
                ? "Search projects..." 
                : viewType === 'table' 
                  ? "Search members or projects..."
                  : rundownMode === 'projects' 
                    ? "Search projects..."
                    : "Search members..."
            }
            value={filters.searchTerm}
            onChange={(e) => onFilterChange('searchTerm', e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* Office Filter */}
        <Select value={filters.office} onValueChange={(value) => onFilterChange('office', value)}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Offices" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Offices</SelectItem>
          </SelectContent>
        </Select>

        {/* Department Filter */}
        <Select value={filters.department} onValueChange={(value) => onFilterChange('department', value)}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
          </SelectContent>
        </Select>

        {/* Location Filter */}
        <Select value={filters.location} onValueChange={(value) => onFilterChange('location', value)}>
          <SelectTrigger className="w-36 h-9">
            <SelectValue placeholder="All Locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-9"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};
