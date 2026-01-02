import { useState, useMemo, useCallback, useEffect } from 'react';
import { startOfWeek } from 'date-fns';
import { ViewType, RundownMode, SortOption, TableOrientation } from '@/components/week-resourcing/UnifiedWeeklyControls';

export const useWeeklyOverviewState = () => {
  // View state - persist in localStorage
  const [viewType, setViewType] = useState<ViewType>(() => {
    const saved = localStorage.getItem('weekly-view-type');
    return (saved as ViewType) || 'table';
  });
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [filters, setFilters] = useState({
    practiceArea: "all",
    department: "all",
    location: "all",
    searchTerm: ""
  });

  // Table-specific state
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');
  const [tableOrientation, setTableOrientation] = useState<TableOrientation>('per-person');

  // Grid/Carousel-specific state
  const [rundownMode, setRundownMode] = useState<RundownMode>('people');
  const [sortOption, setSortOption] = useState<SortOption>('utilization');
  const [isAutoAdvance, setIsAutoAdvance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handlers
  const handleWeekChange = useCallback((date: Date) => {
    setSelectedWeek(date);
  }, []);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      practiceArea: 'all',
      department: 'all',
      location: 'all',
      searchTerm: ''
    });
  }, []);

  const handleViewTypeChange = useCallback((view: ViewType) => {
    setViewType(view);
    localStorage.setItem('weekly-view-type', view);
  }, []);

  const handleModeChange = useCallback((mode: RundownMode) => {
    setRundownMode(mode);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortOption(sort);
  }, []);

  const handleAutoAdvanceToggle = useCallback(() => {
    setIsAutoAdvance(prev => !prev);
  }, []);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(prev => {
      const newState = !prev;
      if (newState) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      return newState;
    });
  }, []);

  // Keep app state in sync with browser fullscreen + ensure ESC exits back to normal layout
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown, { capture: true });

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
    };
  }, []);

  const activeFiltersCount = useMemo(() => [
    filters.practiceArea !== 'all' ? 'practiceArea' : '',
    filters.department !== 'all' ? 'department' : '',
    filters.location !== 'all' ? 'location' : '',
    filters.searchTerm ? 'search' : ''
  ].filter(Boolean).length, [filters.practiceArea, filters.department, filters.location, filters.searchTerm]);

  return {
    // State
    viewType,
    selectedWeek,
    filters,
    viewMode,
    tableOrientation,
    rundownMode,
    sortOption,
    isAutoAdvance,
    isFullscreen,
    activeFiltersCount,
    
    // Setters
    setViewMode,
    setTableOrientation,
    
    // Handlers
    handleWeekChange,
    handleFilterChange,
    clearFilters,
    handleViewTypeChange,
    handleModeChange,
    handleSortChange,
    handleAutoAdvanceToggle,
    handleFullscreenToggle,
  };
};
