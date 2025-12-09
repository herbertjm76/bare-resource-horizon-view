import React, { useMemo, useCallback } from 'react';
import { StandardLayout } from '@/components/layout/StandardLayout';
import { StandardizedPageHeader } from '@/components/layout/StandardizedPageHeader';
import { WeekResourceView } from '@/components/week-resourcing/WeekResourceView';
import { RundownGridView } from '@/components/weekly-rundown/RundownGridView';
import { RundownCarousel } from '@/components/weekly-rundown/RundownCarousel';
import { UnifiedWeeklyControls } from '@/components/week-resourcing/UnifiedWeeklyControls';
import { WeeklySummaryCards } from '@/components/weekly-rundown/WeeklySummaryCards';
import { AvailableMembersRow } from '@/components/weekly-rundown/AvailableMembersRow';
import { MemberFilterRow } from '@/components/resources/MemberFilterRow';
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

  // Centralized data fetching
  const data = useWeeklyOverviewData(selectedWeek, filters);
  const {
    allMembers,
    projects,
    isLoading,
    error,
    getMemberTotalForRundown,
    getProjectCount,
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

  // Sort members to match the same order as rundownItems for consistency
  // This directly applies the same sorting logic used in useRundownData
  const sortedMembers = useMemo(() => {
    console.log('Computing sortedMembers - allMembers count:', allMembers.length, 'sortOption:', sortOption);
    
    // Sort allMembers directly with the same logic as useRundownData
    const result = [...allMembers].sort((a, b) => {
      const nameA = `${a.first_name || ''} ${a.last_name || ''}`;
      const nameB = `${b.first_name || ''} ${b.last_name || ''}`;
      
      switch (sortOption) {
        case 'alphabetical':
          return nameA.localeCompare(nameB);
        case 'utilization':
          // Get utilization data for proper sorting
          const aTotal = getMemberTotalForRundown(a.id);
          const bTotal = getMemberTotalForRundown(b.id);
          const aCapacity = a.weekly_capacity || 40;
          const bCapacity = b.weekly_capacity || 40;
          const aUtil = aCapacity > 0 ? (aTotal?.resourcedHours || 0) / aCapacity * 100 : 0;
          const bUtil = bCapacity > 0 ? (bTotal?.resourcedHours || 0) / bCapacity * 100 : 0;
          return bUtil - aUtil; // High to low
        case 'location':
          return (a.location || '').localeCompare(b.location || '');
        case 'department':
          return (a.department || '').localeCompare(b.department || '');
        default:
          return 0;
      }
    });
    
    console.log('sortedMembers result - first 3:', result.slice(0, 3).map(m => `${m.first_name} ${m.last_name}`));
    return result;
  }, [allMembers, sortOption, getMemberTotalForRundown]);

  // Debug logging
  console.log('WeeklyOverview - View State:', {
    viewType,
    rundownMode,
    rundownItemsCount: rundownItems.length,
    allMembersCount: allMembers.length,
    projectsCount: projects.length,
    sortOption,
    firstSortedMember: sortedMembers[0] ? `${sortedMembers[0].first_name} ${sortedMembers[0].last_name}` : 'none',
    firstRundownItem: rundownItems[0] ? rundownItems[0].name : 'none'
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
          pullingContent=""
          refreshingContent={
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          }
          className="pull-to-refresh-container"
        >
          <div className={`space-y-0 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-8 overflow-auto' : ''}`}>
            {/* Page Header */}
            {!isFullscreen && (
              <div className="mb-1.5">
                <StandardizedPageHeader
                  title="Weekly Overview"
                  description="Switch between table, grid, and carousel views to manage your team's weekly resource allocation"
                  icon={Calendar}
                />
              </div>
            )}

            {/* Summary Cards */}
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

            {/* Connected Filter and Content Section */}
            <div className="mt-0">
              {/* Unified Controls */}
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

              {/* Member Filter Row */}
              <MemberFilterRow
                filters={filters}
                onFilterChange={handleFilterChange}
                clearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
              />

              {/* Available Members Row */}
              <AvailableMembersRow
                weekStartDate={weekStartString}
                threshold={80}
                filters={filters}
                sortOption={sortOption}
                allMembers={sortedMembers}
              />

              {/* Table View */}
              {viewType === 'table' && (
                <WeekResourceView
                  selectedWeek={selectedWeek}
                  setSelectedWeek={handleWeekChange}
                  weekLabel={weekLabel}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  tableOrientation={tableOrientation}
                  sortOption={sortOption}
                />
              )}

              {/* Grid View */}
              {viewType === 'grid' && (
                <div className="mt-4">
                  <RundownGridView
                    items={rundownItems}
                    rundownMode={rundownMode}
                    isFullscreen={isFullscreen}
                    selectedWeek={selectedWeek}
                  />
                </div>
              )}

              {/* Carousel View */}
              {viewType === 'carousel' && (
                <div className="mt-4">
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
                </div>
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
