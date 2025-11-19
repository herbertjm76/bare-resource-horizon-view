import React, { useState, useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { RundownGridView } from '@/components/weekly-rundown/RundownGridView';
import { RundownCarousel } from '@/components/weekly-rundown/RundownCarousel';
import { UnifiedWeeklyControls, ViewType, RundownMode, SortOption } from '@/components/week-resourcing/UnifiedWeeklyControls';
import { WeeklySummaryCards } from '@/components/weekly-rundown/WeeklySummaryCards';
import { AvailableMembersRow } from '@/components/weekly-rundown/AvailableMembersRow';
import { useStreamlinedWeekResourceData } from '@/components/week-resourcing/hooks/useStreamlinedWeekResourceData';
import { useRundownData } from '@/components/weekly-rundown/hooks/useRundownData';
import { useCarouselNavigation } from '@/components/weekly-rundown/hooks/useCarouselNavigation';
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { OfficeSettingsProvider } from '@/context/officeSettings';
import { startOfWeek, format } from 'date-fns';
import { Toaster } from 'sonner';
import { Calendar } from 'lucide-react';

const WeeklyOverview = () => {
  // View state - persist in localStorage
  const [viewType, setViewType] = useState<ViewType>(() => {
    const saved = localStorage.getItem('weekly-view-type');
    return (saved as ViewType) || 'table';
  });
  
  const [selectedWeek, setSelectedWeek] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  
  const [filters, setFilters] = useState({
    office: "all",
    searchTerm: ""
  });

  // Table-specific state
  const [viewMode, setViewMode] = useState<'compact' | 'expanded'>('compact');

  // Grid/Carousel-specific state
  const [rundownMode, setRundownMode] = useState<RundownMode>('people');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');
  const [isAutoAdvance, setIsAutoAdvance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Card visibility preferences
  const { visibility: cardVisibility, cardOrder, toggleCard, moveCard, reorderCards } = useCardVisibility();

  // Stable filters for data fetching
  const stableFilters = useMemo(() => ({ 
    office: filters.office === 'all' ? '' : filters.office,
    searchTerm: filters.searchTerm 
  }), [filters.office, filters.searchTerm]);

  // Get raw data
  const { 
    allMembers, 
    projects, 
    isLoading, 
    error,
    getMemberTotalForRundown,
    getProjectCount 
  } = useStreamlinedWeekResourceData(selectedWeek, stableFilters);

  // Process data for grid/carousel views
  const { rundownItems } = useRundownData({
    allMembers,
    projects,
    rundownMode,
    sortOption,
    getMemberTotal: getMemberTotalForRundown,
    getProjectCount
  });

  // Carousel navigation
  const {
    currentIndex,
    nextItem,
    prevItem,
    goToItem,
    toggleAutoAdvance
  } = useCarouselNavigation({
    totalItems: rundownItems.length,
    autoAdvance: isAutoAdvance,
    interval: 10000
  });

  const weekLabel = useMemo(() => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    return `Week of ${format(weekStart, 'MMM d, yyyy')}`;
  }, [selectedWeek]);

  const weekStartString = useMemo(() => 
    format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    [selectedWeek]
  );

  const memberIds = useMemo(() => 
    allMembers.map(m => m.id),
    [allMembers]
  );

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
      office: 'all',
      searchTerm: ''
    });
  }, []);

  const activeFiltersCount = useMemo(() => [
    filters.office !== 'all' ? 'office' : '',
    filters.searchTerm ? 'search' : ''
  ].filter(Boolean).length, [filters.office, filters.searchTerm]);

  const handleViewTypeChange = useCallback((view: ViewType) => {
    setViewType(view);
    localStorage.setItem('weekly-view-type', view);
    // Reset to first item when changing to carousel
    if (view === 'carousel') {
      goToItem(0);
    }
  }, [goToItem]);

  const handleModeChange = useCallback((mode: RundownMode) => {
    setRundownMode(mode);
    goToItem(0);
  }, [goToItem]);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortOption(sort);
    goToItem(0);
  }, [goToItem]);

  const handleAutoAdvanceToggle = useCallback(() => {
    setIsAutoAdvance(!isAutoAdvance);
    toggleAutoAdvance();
  }, [isAutoAdvance, toggleAutoAdvance]);

  const handleFullscreenToggle = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullscreen]);

  if (isLoading) {
    return (
      <StandardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading weekly data...</p>
          </div>
        </div>
      </StandardLayout>
    );
  }

  if (error) {
    return (
      <StandardLayout>
        <div className="text-center p-8">
          <p className="text-destructive">Error loading weekly data</p>
        </div>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout>
      <OfficeSettingsProvider>
        <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-8 overflow-auto' : ''}`}>
          {/* Page Header - Hidden in fullscreen */}
          {!isFullscreen && (
          <StandardizedPageHeader
            title="Weekly Overview"
            description="Switch between table, grid, and carousel views to manage your team's weekly resource allocation"
            icon={Calendar}
          />
          )}

          {/* Summary Cards - Always visible except fullscreen */}
          {!isFullscreen && (
            <WeeklySummaryCards
              selectedWeek={selectedWeek}
              memberIds={memberIds}
              cardVisibility={cardVisibility}
              cardOrder={cardOrder}
              toggleCard={toggleCard}
              moveCard={moveCard}
              reorderCards={reorderCards}
            />
          )}

          {/* Available Members Row - Always visible except in fullscreen */}
          {!isFullscreen && (
            <AvailableMembersRow 
              weekStartDate={weekStartString}
              threshold={80}
            />
          )}

          {/* Unified Controls */}
          <UnifiedWeeklyControls
            selectedWeek={selectedWeek}
            onWeekChange={handleWeekChange}
            weekLabel={weekLabel}
            viewType={viewType}
            onViewTypeChange={handleViewTypeChange}
            filters={filters}
            onFilterChange={handleFilterChange}
            activeFiltersCount={activeFiltersCount}
            clearFilters={clearFilters}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            rundownMode={rundownMode}
            onModeChange={handleModeChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
            isAutoAdvance={isAutoAdvance}
            onAutoAdvanceToggle={handleAutoAdvanceToggle}
            currentIndex={currentIndex}
            totalItems={rundownItems.length}
            isFullscreen={isFullscreen}
            onFullscreenToggle={handleFullscreenToggle}
          />

          {/* View Content */}
          {viewType === 'table' && (
            <WeekResourceView
              selectedWeek={selectedWeek}
              setSelectedWeek={setSelectedWeek}
              onWeekChange={handleWeekChange}
              weekLabel={weekLabel}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

          {viewType === 'grid' && (
            <RundownGridView
              items={rundownItems}
              rundownMode={rundownMode}
              isFullscreen={isFullscreen}
              selectedWeek={selectedWeek}
            />
          )}

          {viewType === 'carousel' && (
            <RundownCarousel
              items={rundownItems}
              currentIndex={currentIndex}
              rundownMode={rundownMode}
              onNext={nextItem}
              onPrev={prevItem}
              onGoTo={goToItem}
              isFullscreen={isFullscreen}
              selectedWeek={selectedWeek}
            />
          )}
        </div>
      </OfficeSettingsProvider>
      <Toaster position="top-right" />
    </StandardLayout>
  );
};

export default WeeklyOverview;
