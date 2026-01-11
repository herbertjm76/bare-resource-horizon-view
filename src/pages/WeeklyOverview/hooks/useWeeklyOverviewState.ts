import { useState, useMemo, useCallback, useEffect } from 'react';
import { ViewType, RundownMode, SortOption, TableOrientation } from '@/components/week-resourcing/UnifiedWeeklyControls';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';

export const useWeeklyOverviewState = () => {
  const { startOfWorkWeek } = useAppSettings();

  // View state - persist in localStorage
  const [viewType, setViewType] = useState<ViewType>(() => {
    const saved = localStorage.getItem('weekly-view-type');
    return (saved as ViewType) || 'table';
  });

  const [selectedWeek, setSelectedWeek] = useState<Date>(() => getWeekStartDate(new Date(), startOfWorkWeek));
  
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
    // Always snap to the correct company week start for consistency across reads/writes.
    setSelectedWeek(getWeekStartDate(date, startOfWorkWeek));
  }, [startOfWorkWeek]);

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
    const newState = !isFullscreen;
    setIsFullscreen(newState);
    
    if (newState) {
      document.documentElement.requestFullscreen?.();
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    }
  }, [isFullscreen]);

  // Keep selectedWeek aligned if company week start day changes.
  useEffect(() => {
    setSelectedWeek(prev => getWeekStartDate(prev, startOfWorkWeek));
  }, [startOfWorkWeek]);

  // Sync app state when browser exits fullscreen (e.g., user presses ESC natively)
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Only sync when exiting - the browser exited fullscreen
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }; 
  }, [isFullscreen]);

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
