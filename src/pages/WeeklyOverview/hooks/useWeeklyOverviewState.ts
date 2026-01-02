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
    // Use app-level fullscreen (CSS overlay) only.
    // Native Fullscreen API is too fragile in embedded/iframe contexts and can exit unexpectedly.
    setIsFullscreen(prev => !prev);
  }, []);

  // We intentionally do NOT sync with the browser Fullscreen API here.
  // App "fullscreen" is a CSS overlay and should only change via our toggle or ESC.


  // ESC key handler ONLY when we're in our custom fullscreen mode
  useEffect(() => {
    if (!isFullscreen) return; // Don't listen when not in fullscreen

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setIsFullscreen(false);
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener('keydown', handleKeyDown, { capture: true } as any);
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
