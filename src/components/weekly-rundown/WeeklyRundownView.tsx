import React, { useState, useMemo } from 'react';
import { format, startOfWeek } from 'date-fns';
import { useStreamlinedWeekResourceData } from '@/components/week-resourcing/hooks/useStreamlinedWeekResourceData';
import { RundownControls } from './RundownControls';
import { RundownCarousel } from './RundownCarousel';
import { RundownGridView } from './RundownGridView';
import { WeeklySummaryCards } from './WeeklySummaryCards';
import { useRundownData } from './hooks/useRundownData';
import { useCarouselNavigation } from './hooks/useCarouselNavigation';

export type RundownMode = 'people' | 'projects';
export type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';
export type ViewType = 'carousel' | 'grid';

export const WeeklyRundownView: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [rundownMode, setRundownMode] = useState<RundownMode>('people');
  const [sortOption, setSortOption] = useState<SortOption>('alphabetical');
  const [viewType, setViewType] = useState<ViewType>('carousel');
  const [isAutoAdvance, setIsAutoAdvance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Stable filters for data fetching
  const stableFilters = useMemo(() => ({ office: '' }), []);

  // Get raw data
  const { 
    allMembers, 
    projects, 
    isLoading, 
    error,
    getMemberTotalForRundown,
    getProjectCount 
  } = useStreamlinedWeekResourceData(selectedWeek, stableFilters);

  // Process data for rundown
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
    interval: 10000 // 10 seconds
  });

  const weekLabel = useMemo(() => {
    const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
    return `Week of ${format(weekStart, 'MMM d, yyyy')}`;
  }, [selectedWeek]);

  // Get all member IDs for summary cards
  const memberIds = useMemo(() => 
    allMembers.map(m => m.id),
    [allMembers]
  );

  const handleWeekChange = (date: Date) => {
    setSelectedWeek(date);
  };

  const handleModeChange = (mode: RundownMode) => {
    setRundownMode(mode);
    // Reset to first item when changing mode
    goToItem(0);
  };

  const handleSortChange = (sort: SortOption) => {
    setSortOption(sort);
    // Reset to first item when changing sort
    goToItem(0);
  };

  const handleAutoAdvanceToggle = () => {
    setIsAutoAdvance(!isAutoAdvance);
    toggleAutoAdvance();
  };

  const handleFullscreenToggle = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rundown data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-destructive">Error loading rundown data</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-8' : ''}`}>
      <RundownControls
        selectedWeek={selectedWeek}
        onWeekChange={handleWeekChange}
        weekLabel={weekLabel}
        rundownMode={rundownMode}
        onModeChange={handleModeChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
        viewType={viewType}
        onViewTypeChange={setViewType}
        isAutoAdvance={isAutoAdvance}
        onAutoAdvanceToggle={handleAutoAdvanceToggle}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        currentIndex={currentIndex}
        totalItems={rundownItems.length}
      />

      <WeeklySummaryCards 
        selectedWeek={selectedWeek}
        memberIds={memberIds}
      />

      {viewType === 'carousel' ? (
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
      ) : (
        <RundownGridView
          items={rundownItems}
          rundownMode={rundownMode}
          isFullscreen={isFullscreen}
          selectedWeek={selectedWeek}
        />
      )}
    </div>
  );
};