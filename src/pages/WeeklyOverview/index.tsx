import React, { useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { RundownGridView } from '@/components/weekly-rundown/RundownGridView';
import { RundownCarousel } from '@/components/weekly-rundown/RundownCarousel';
import { UnifiedWeeklyControls } from '@/components/week-resourcing/UnifiedWeeklyControls';
import { WeeklySummaryCards } from '@/components/weekly-rundown/WeeklySummaryCards';
import { AvailableMembersRow } from '@/components/weekly-rundown/AvailableMembersRow';

import { useRundownData } from '@/components/weekly-rundown/hooks/useRundownData';
import { useCarouselNavigation } from '@/components/weekly-rundown/hooks/useCarouselNavigation';
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { useWeeklyOverviewData } from './hooks/useWeeklyOverviewData';
import { useWeeklyOverviewState } from './hooks/useWeeklyOverviewState';
import { OfficeSettingsProvider } from '@/context/officeSettings';
import { startOfWeek, format } from 'date-fns';
import { Toaster, toast } from 'sonner';
import { Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import PullToRefresh from 'react-simple-pull-to-refresh';
import '@/components/weekly-rundown/index.css';


const WeeklyOverview = () => {
  const queryClient = useQueryClient();
  
  // State management
  const state = useWeeklyOverviewState();
  const {
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
    setViewMode,
    setTableOrientation,
    handleWeekChange,
    handleFilterChange,
    clearFilters,
    handleViewTypeChange,
    handleModeChange,
    handleSortChange,
    handleAutoAdvanceToggle,
    handleFullscreenToggle,
  } = state;

  // Card visibility preferences
  const { visibility: cardVisibility, cardOrder, toggleCard, moveCard, reorderCards } = useCardVisibility();

  // Centralized data fetching with sorting - SINGLE SOURCE OF TRUTH
  const data = useWeeklyOverviewData(selectedWeek, filters, sortOption);
  const {
    allMembers,
    projects,
    isLoading,
    error,
    getMemberTotalForRundown,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    allocationMap,
    annualLeaveData,
    holidaysData,
    otherLeaveData,
    updateOtherLeave,
    memberIds,
    profiles,
    invites,
    availableMembersAllocations,
    annualLeaves,
    holidays,
    otherLeaves,
    weeklyNotes,
    customCardTypes,
    weekStartString,
  } = data;

  // Process data for grid/carousel views
  const { rundownItems } = useRundownData({
    allMembers,
    projects,
    rundownMode,
    sortOption,
    getMemberTotal: getMemberTotalForRundown,
    getProjectCount
  });

  // allMembers is now already sorted from the centralized hook - no additional sorting needed

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

  // Create unfiltered members list for the avatar row (not affected by filters)
  const unfilteredMembers = useMemo(() => {
    const combined = [
      ...(profiles || []).map(p => ({ ...p, status: 'active' })),
      ...(invites || []).map(i => ({ ...i, status: 'pre_registered' }))
    ];
    return combined.sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase();
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [profiles, invites]);

  const handleRefresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ['streamlined-week-resource-data'] });
    await queryClient.invalidateQueries({ queryKey: ['active-team-members'] });
    await queryClient.invalidateQueries({ queryKey: ['pre-registered-members'] });
    await queryClient.invalidateQueries({ queryKey: ['available-members-profiles'] });
    await queryClient.invalidateQueries({ queryKey: ['available-members-invites'] });
    await queryClient.invalidateQueries({ queryKey: ['available-allocations'] });
    await queryClient.invalidateQueries({ queryKey: ['weekly-summary'] });
    
    toast.success('Weekly data refreshed!');
  }, [queryClient]);

  // Handle view type changes with carousel reset
  const handleViewTypeChangeWithReset = useCallback((view: typeof viewType) => {
    handleViewTypeChange(view);
    if (view === 'carousel') {
      goToItem(0);
    }
  }, [handleViewTypeChange, goToItem]);

  // Handle mode/sort changes with carousel reset
  const handleModeChangeWithReset = useCallback((mode: typeof rundownMode) => {
    handleModeChange(mode);
    goToItem(0);
  }, [handleModeChange, goToItem]);

  const handleSortChangeWithReset = useCallback((sort: typeof sortOption) => {
    handleSortChange(sort);
    goToItem(0);
  }, [handleSortChange, goToItem]);

  const handleAutoAdvanceToggleWithCarousel = useCallback(() => {
    handleAutoAdvanceToggle();
    toggleAutoAdvance();
  }, [handleAutoAdvanceToggle, toggleAutoAdvance]);

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
        <PullToRefresh 
          onRefresh={handleRefresh}
          isPullable={!isFullscreen}
          pullingContent=""
          refreshingContent={
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          }
          className="pull-to-refresh-container"
        >
          <div className={`space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-8 overflow-auto' : ''}`}>
          {/* Page Header - hidden in fullscreen */}
            {!isFullscreen && (
              <AnimatedSection animation="cascadeUp" className="mb-1.5">
                <StandardizedPageHeader
                  title="Weekly Overview"
                  description="Switch between table, grid, and carousel views to manage your team's weekly resource allocation"
                  icon={Calendar}
                  isFullscreen={isFullscreen}
                  onFullscreenToggle={handleFullscreenToggle}
                />
              </AnimatedSection>
            )}

            {/* Summary Cards */}
            <AnimatedSection animation="cascadeUp" delay={100} staggerChildren staggerDelay={50}>
              <WeeklySummaryCards
                selectedWeek={selectedWeek}
                memberIds={memberIds}
                cardVisibility={cardVisibility}
                cardOrder={cardOrder}
                toggleCard={toggleCard}
                moveCard={moveCard}
                reorderCards={reorderCards}
                annualLeaves={annualLeaves}
                holidays={holidays}
                otherLeaves={otherLeaves}
                weeklyNotes={weeklyNotes}
                customCardTypes={customCardTypes}
              />
            </AnimatedSection>

            {/* Connected Filter and Content Section */}
            <div className="mt-0">
              {/* Available Members Row - FIRST (shows availability/utilization) - NOT filtered */}
              <AnimatedSection animation="cascadeUp" delay={200} staggerChildren staggerDelay={30}>
                <AvailableMembersRow
                  weekStartDate={weekStartString}
                  threshold={80}
                  allMembers={unfilteredMembers}
                  sortOption={sortOption}
                />
              </AnimatedSection>

              {/* Unified Controls + Filters Combined */}
              <AnimatedSection animation="cascadeUp" delay={300} staggerChildren staggerDelay={40}>
                <UnifiedWeeklyControls
                  selectedWeek={selectedWeek}
                  onWeekChange={handleWeekChange}
                  weekLabel={weekLabel}
                  viewType={viewType}
                  onViewTypeChange={handleViewTypeChangeWithReset}
                  rundownMode={rundownMode}
                  onModeChange={handleModeChangeWithReset}
                  sortOption={sortOption}
                  onSortChange={handleSortChangeWithReset}
                  isAutoAdvance={isAutoAdvance}
                  onAutoAdvanceToggle={handleAutoAdvanceToggleWithCarousel}
                  isFullscreen={isFullscreen}
                  onFullscreenToggle={handleFullscreenToggle}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  tableOrientation={tableOrientation}
                  onTableOrientationChange={setTableOrientation}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  activeFiltersCount={activeFiltersCount}
                  clearFilters={clearFilters}
                />
              </AnimatedSection>

              {/* Table View */}
              {viewType === 'table' && (
                <AnimatedSection animation="cascadeUp" delay={400} staggerChildren staggerDelay={50}>
                  <WeekResourceView
                    selectedWeek={selectedWeek}
                    weekLabel={weekLabel}
                    tableOrientation={tableOrientation}
                    allMembers={allMembers}
                    projects={projects}
                    isLoading={isLoading}
                    error={error}
                    allocationMap={allocationMap}
                    annualLeaveData={annualLeaveData}
                    holidaysData={holidaysData}
                    otherLeaveData={otherLeaveData}
                    getMemberTotal={getMemberTotal}
                    getProjectCount={getProjectCount}
                    getWeeklyLeave={getWeeklyLeave}
                    updateOtherLeave={updateOtherLeave}
                    searchTerm={filters.searchTerm}
                  />
                </AnimatedSection>
              )}

              {/* Grid View */}
              {viewType === 'grid' && (
                <AnimatedSection animation="cascadeUp" delay={400} staggerChildren staggerDelay={60} className="mt-4">
                  <RundownGridView
                    items={rundownItems}
                    rundownMode={rundownMode}
                    isFullscreen={isFullscreen}
                    selectedWeek={selectedWeek}
                  />
                </AnimatedSection>
              )}

              {/* Carousel View */}
              {viewType === 'carousel' && (
                <AnimatedSection animation="cascadeUp" delay={400} staggerChildren staggerDelay={50} className="mt-4">
                  <RundownCarousel
                    items={rundownItems}
                    rundownMode={rundownMode}
                    currentIndex={currentIndex}
                    onNext={nextItem}
                    onPrev={prevItem}
                    onGoTo={goToItem}
                    selectedWeek={selectedWeek}
                    isFullscreen={isFullscreen}
                  />
                </AnimatedSection>
              )}
            </div>
          </div>
        </PullToRefresh>
        <Toaster />
      </OfficeSettingsProvider>
    </StandardLayout>
  );
};

export default WeeklyOverview;
