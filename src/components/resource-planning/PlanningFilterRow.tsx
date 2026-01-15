import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Search, X, ChevronLeft, ChevronRight, Filter, Plus, FolderOpen
} from 'lucide-react';
import { SavedPresetsDropdown } from '@/components/filters/SavedPresetsDropdown';
import { ViewType } from '@/hooks/useViewPresets';

interface PlanningFilterRowProps {
  departmentFilter: string;
  onDepartmentChange: (value: string) => void;
  departments: Array<{ id: string; name: string }>;
  statusFilter: string[];
  onStatusToggle: (status: string) => void;
  onStatusFilterChange?: (statuses: string[]) => void;
  statusOptions: string[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  projectCount: number;
  totalProjects: number;
  onCreateProject: () => void;
  showBudget: boolean;
  onShowBudgetChange: (show: boolean) => void;
  viewType?: ViewType;
}

export const PlanningFilterRow: React.FC<PlanningFilterRowProps> = ({
  departmentFilter,
  onDepartmentChange,
  departments,
  statusFilter,
  onStatusToggle,
  onStatusFilterChange,
  statusOptions,
  searchTerm,
  onSearchChange,
  projectCount,
  totalProjects,
  onCreateProject,
  showBudget,
  onShowBudgetChange,
  viewType = 'resource_planning'
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
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

  // Check scroll when departments change
  useEffect(() => {
    checkScroll();
  }, [departments.length, checkScroll]);

  const activeFiltersCount = (departmentFilter !== 'all' ? 1 : 0) + 
    (searchTerm ? 1 : 0) + 
    (statusFilter.length !== statusOptions.length ? 1 : 0);

  // Get current filters as object for presets
  const currentFilters = {
    departmentFilter,
    statusFilter,
    searchTerm,
    showBudget
  };

  // Apply preset filters
  const handleApplyPreset = (filters: Record<string, any>) => {
    if (filters.departmentFilter !== undefined) {
      onDepartmentChange(filters.departmentFilter);
    }
    if (filters.statusFilter !== undefined && onStatusFilterChange) {
      onStatusFilterChange(filters.statusFilter);
    }
    if (filters.searchTerm !== undefined) {
      onSearchChange(filters.searchTerm);
    }
    if (filters.showBudget !== undefined) {
      onShowBudgetChange(filters.showBudget);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-border/50">
      {/* Saved Presets */}
      <SavedPresetsDropdown
        viewType={viewType}
        currentFilters={currentFilters}
        onApplyPreset={handleApplyPreset}
      />

      {/* Department Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-md border border-border/60 bg-background">
        <FolderOpen className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Department Badges */}
      <div 
        ref={badgeContainerRef}
        className="flex gap-1.5 overflow-x-auto flex-1 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <Badge
          variant={departmentFilter === 'all' ? 'default' : 'outline'}
          className={`cursor-pointer whitespace-nowrap transition-all text-xs px-2.5 py-0.5 ${
            departmentFilter === 'all' ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent bg-background'
          }`}
          onClick={() => onDepartmentChange('all')}
        >
          All
        </Badge>

        {departments.map((dept) => (
          <Badge
            key={dept.id}
            variant={departmentFilter === dept.name ? 'default' : 'outline'}
            className={`cursor-pointer whitespace-nowrap transition-all text-xs px-2.5 py-0.5 ${
              departmentFilter === dept.name ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'hover:bg-accent bg-background'
            }`}
            onClick={() => onDepartmentChange(dept.name)}
          >
            {dept.name}
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
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      {canScrollRight && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 shrink-0"
          onClick={() => scrollBadges('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span className="text-xs">Status</span>
            {statusFilter.length !== statusOptions.length && (
              <Badge variant="secondary" className="ml-1 h-4 px-1 text-xs">
                {statusFilter.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-48 bg-background z-50">
          <div className="space-y-2">
            {statusOptions.map(status => (
              <div key={status} className="flex items-center gap-2">
                <Checkbox
                  id={`planning-${status}`}
                  checked={statusFilter.includes(status)}
                  onCheckedChange={() => onStatusToggle(status)}
                />
                <Label htmlFor={`planning-${status}`} className="text-sm cursor-pointer">
                  {status}
                </Label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Show Budget Toggle */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Checkbox
          id="show-budget-toggle"
          checked={showBudget}
          onCheckedChange={(checked) => onShowBudgetChange(!!checked)}
          className="h-4 w-4"
        />
        <Label htmlFor="show-budget-toggle" className="text-xs cursor-pointer whitespace-nowrap">
          Budget
        </Label>
      </div>

      {/* Clear filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            onDepartmentChange('all');
            onSearchChange('');
          }}
          className="h-8 w-8 p-0 shrink-0"
          title="Clear filters"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      {/* Search */}
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className={`h-8 w-8 p-0 shrink-0 ${searchTerm ? 'ring-2 ring-primary' : ''}`}
          >
            <Search className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 bg-background z-50" align="end">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Search Projects</h4>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by name or code..."
                className="pl-8 h-8"
                autoFocus
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Project count & New button */}
      <div className="flex items-center gap-2 shrink-0 ml-2 pl-2 border-l border-border/50">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {projectCount}/{totalProjects}
        </span>
        <Button size="sm" className="h-8 gap-1.5" onClick={onCreateProject}>
          <Plus className="h-3.5 w-3.5" />
          <span className="text-xs">New</span>
        </Button>
      </div>
    </div>
  );
};
