import { useState, useEffect, useCallback } from 'react';
import { useResourceAllocationState } from '@/hooks/allocations/useResourceAllocationState';
import { useFetchAllocations } from '@/hooks/allocations/useFetchAllocations';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { format } from 'date-fns';

/**
 * Main hook that combines allocation state management and data fetching
 * OPTIMIZED: Removed artificial delays to ensure instant UI updates
 */
export function useResourceAllocations(teamMembers: any[], selectedWeek: Date) {
  // Track if this is the initial load
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const { startOfWorkWeek } = useAppSettings();

  // Get allocation state management functions
  const {
    memberAllocations,
    setMemberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading: allocationsStateLoading,
    setIsLoading: setAllocationsStateLoading,
    error,
    setError,
  } = useResourceAllocationState();

  // Get allocation data fetching function
  const { fetchAllocations } = useFetchAllocations();

  const selectedWeekKey = format(getWeekStartDate(selectedWeek, startOfWorkWeek), 'yyyy-MM-dd');

  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    logger.log('useResourceAllocations effect triggered with week:', selectedWeek);
    logger.log('Team members count:', teamMembers.length);

    if (teamMembers.length === 0) {
      setAllocationsStateLoading(false);
      setIsInitialLoad(false);
      return;
    }

    // Set loading state
    setAllocationsStateLoading(true);

    const loadData = async () => {
      try {
        await fetchAllocations(teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError);

        // Mark that initial load is complete immediately
        setIsInitialLoad(false);
      } catch (err) {
        logger.error('Failed to load allocations:', err);
        const error = err instanceof Error ? err : new Error('Failed to load allocations');
        setError(error);
        setAllocationsStateLoading(false);
        setIsInitialLoad(false);
        toast.error('Failed to load allocations');
      }
    };

    loadData();
  }, [
    fetchAllocations,
    teamMembers,
    selectedWeek,
    setMemberAllocations,
    setAllocationsStateLoading,
    setError,
  ]);

  // Keep Weekly Overview in sync with edits made elsewhere (dialogs, other views)
  useEffect(() => {
    const onAllocationUpdated = (event: Event) => {
      const detail = (event as CustomEvent).detail as
        | {
            weekKey?: string;
            resourceId?: string;
            memberId?: string;
            projectId?: string;
            hours?: number;
          }
        | undefined;

      if (!detail?.projectId) return;

      const weekKey = detail.weekKey;
      if (weekKey && weekKey !== selectedWeekKey) return;

      const memberId = detail.resourceId || detail.memberId;
      if (!memberId) return;

      const nextHours = Number(detail.hours ?? 0);

      // Optimistic patch into local state so UI updates instantly (no refetch)
      setMemberAllocations((prev) => {
        const allocation = getMemberAllocation(memberId);

        const nextProjectAllocations = (allocation.projectAllocations || []).map((p) =>
          p.projectId === detail.projectId ? { ...p, hours: nextHours } : p
        );

        // If the project isn't present in the list yet (rare), fall back to refetch behavior
        const hasProject = (allocation.projectAllocations || []).some((p) => p.projectId === detail.projectId);
        if (!hasProject) {
          return prev;
        }

        const projectHours = nextProjectAllocations.reduce((sum, p) => sum + (p.hours || 0), 0);
        const projectCount = nextProjectAllocations.filter((p) => (p.hours || 0) > 0).length;

        const leaveHours =
          (allocation.annualLeave || 0) +
          (allocation.publicHoliday || 0) +
          (allocation.vacationLeave || 0) +
          (allocation.medicalLeave || 0) +
          (allocation.others || 0);

        return {
          ...prev,
          [memberId]: {
            ...allocation,
            projectAllocations: nextProjectAllocations,
            projects: nextProjectAllocations.filter((p) => (p.hours || 0) > 0).map((p) => p.projectId),
            projectHours,
            projectCount,
            resourcedHours: projectHours + leaveHours,
          },
        };
      });
    };

    window.addEventListener('allocation-updated', onAllocationUpdated as EventListener);
    return () => window.removeEventListener('allocation-updated', onAllocationUpdated as EventListener);
  }, [getMemberAllocation, selectedWeekKey, setMemberAllocations]);

  // Function to manually refresh allocations
  const refreshAllocations = useCallback(() => {
    logger.log('Manual refresh of allocations triggered');
    setAllocationsStateLoading(true);

    fetchAllocations(teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError);
  }, [fetchAllocations, teamMembers, selectedWeek, setMemberAllocations, setAllocationsStateLoading, setError]);

  // Calculate totals for each project
  const projectTotals = useCallback(() => {
    const totals: Record<string, number> = {};

    Object.values(memberAllocations).forEach((allocation) => {
      allocation.projectAllocations.forEach((project) => {
        if (!totals[project.projectId]) {
          totals[project.projectId] = 0;
        }
        totals[project.projectId] += project.hours;
      });
    });

    return totals;
  }, [memberAllocations]);

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading: allocationsStateLoading || isInitialLoad,
    error,
    refreshAllocations,
    projectTotals,
  };
}
