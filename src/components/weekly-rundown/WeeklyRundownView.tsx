import React, { useState, useMemo } from 'react';
import { format, startOfWeek } from 'date-fns';
import { useStreamlinedWeekResourceData } from '@/components/week-resourcing/hooks/useStreamlinedWeekResourceData';
import { RundownControls } from './RundownControls';
import { RundownCarousel } from './RundownCarousel';
import { RundownGridView } from './RundownGridView';
import { WeeklySummaryCards } from './WeeklySummaryCards';
import { AvailableMembersRow } from './AvailableMembersRow';
import { useRundownData } from './hooks/useRundownData';
import { useCarouselNavigation } from './hooks/useCarouselNavigation';
import { useCardVisibility } from '@/hooks/useCardVisibility';

export type RundownMode = 'people' | 'projects';
export type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';
export type ViewType = 'carousel' | 'grid';

export const WeeklyRundownView: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [rundownMode, setRundownMode] = useState<RundownMode>('people');
  const [sortOption, setSortOption] = useState<SortOption>('utilization');
  const [viewType, setViewType] = useState<ViewType>('carousel');
  const [isAutoAdvance, setIsAutoAdvance] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get card visibility preferences
  const { visibility: cardVisibility, cardOrder, toggleCard, moveCard, reorderCards } = useCardVisibility();

  // Stable filters for data fetching
  const stableFilters = useMemo(() => ({ office: '' }), []);

  // Get raw data
  const { 
    allMembers, 
    unsortedMembers,
    projects, 
    isLoading, 
    error,
    getMemberTotalForRundown,
    getProjectCount 
  } = useStreamlinedWeekResourceData(selectedWeek, stableFilters, sortOption);

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

  // Precompute week start string before any early returns to keep hooks order stable
  const weekStartString = useMemo(() => 
    format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    [selectedWeek]
  );

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
      <WeeklySummaryCards 
        selectedWeek={selectedWeek}
        memberIds={memberIds}
        cardVisibility={cardVisibility}
        cardOrder={cardOrder}
        toggleCard={toggleCard}
        moveCard={moveCard}
        reorderCards={reorderCards}
      />

      {rundownMode === 'people' && (
        <AvailableMembersRow 
          weekStartDate={weekStartString}
          threshold={80}
          allMembers={unsortedMembers}
        />
      )}

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
        currentIndex={currentIndex}
        totalItems={rundownItems.length}
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