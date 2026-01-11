/**
 * Allocation Rule Book - Runtime Diagnostics
 * 
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  CRITICAL: ALL ALLOCATION WRITES MUST USE CANONICAL API FUNCTIONS BELOW      ║
 * ║  Direct .insert()/.update()/.delete() on project_resource_allocations        ║
 * ║  is FORBIDDEN outside of src/hooks/allocations/api.ts                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * RULE BOOK ENFORCEMENT:
 * - DB stores hours only (not percentages)
 * - Each (company_id, project_id, resource_id, allocation_date) has ONE row
 * - allocation_date is normalized to company week start
 * - All writes go through canonical API (saveResourceAllocation/deleteResourceAllocation/deleteAllResourceAllocationsForProject)
 * - Weekly views read only resource_type='active'
 * 
 * CANONICAL WRITE FUNCTIONS (src/hooks/allocations/api.ts):
 * - saveResourceAllocation(): Save/update a single week's allocation
 * - deleteResourceAllocation(): Delete a single week's allocation
 * - deleteAllResourceAllocationsForProject(): Delete all allocations for a resource on a project
 * 
 * READ PATHS MUST FILTER BY resource_type:
 * - Active team views: .eq('resource_type', 'active')
 * - Pre-registered views: .eq('resource_type', 'pre_registered')
 * - Never mix types when calculating totals for a single view
 * 
 * FILES THAT HAVE BEEN AUDITED AND ARE COMPLIANT:
 * 
 * === CANONICAL WRITE API (only file allowed to do direct writes) ===
 * - src/hooks/allocations/api.ts (saveResourceAllocation, deleteResourceAllocation, deleteAllResourceAllocationsForProject)
 * 
 * === READ PATHS WITH CORRECT resource_type FILTER ===
 * - src/hooks/allocations/utils/fetchUtils.ts
 * - src/hooks/allocations/useResourceUtilization.ts (dynamic resource_type param)
 * - src/hooks/useIndividualMemberUtilization.ts (.eq('resource_type', 'active'))
 * - src/hooks/useTeamUtilization.ts (.eq('resource_type', 'active'))
 * - src/hooks/useStandardizedUtilizationData.ts (.eq('resource_type', 'active'))
 * - src/hooks/usePersonResourceData.ts (intentionally fetches both types for person view)
 * - src/hooks/utilization/usePreRegisteredMembers.ts (.eq('resource_type', 'pre_registered'))
 * - src/hooks/utilization/useActiveMembers.ts (.eq('resource_type', 'active'))
 * - src/hooks/queries/useDashboardQueries.ts (.eq('resource_type', 'active'))
 * - src/components/week-resourcing/hooks/useComprehensiveAllocations.ts (.eq('resource_type', 'active'))
 * - src/components/week-resourcing/hooks/useDetailedWeeklyAllocations.ts (.eq('resource_type', 'active'))
 * - src/components/week-resourcing/hooks/useWeekResourceAllocations.ts (.eq('resource_type', 'active'))
 * - src/components/dashboard/staff/useStaffAllocations.ts (.eq('resource_type', 'active'))
 * - src/components/dashboard/hooks/useResourceAllocationData.ts (.eq('resource_type', 'active'))
 * - src/components/dashboard/hooks/useIndividualUtilization.ts (dynamic resource_type based on isPending)
 * - src/components/weekly-rundown/AvailableMembersRow.tsx (.eq('resource_type', 'active'))
 * - src/components/weekly-rundown/EditableTeamMemberAllocation.tsx (uses canonical API)
 * - src/components/team-member-detail/TeamMemberProjectOverview.tsx (.eq('resource_type', 'active'))
 * - src/components/team-member-detail/TeamMemberProjectAllocations.tsx (.eq('resource_type', 'active'))
 * - src/components/team-member-detail/resource-planning/hooks/useResourcePlanningData.ts (.eq('resource_type', 'active'))
 * - src/components/profile/overview/CapacityCard.tsx (.eq('resource_type', 'active'))
 * - src/components/profile/overview/hooks/useUserProjects.ts (intentionally fetches both types)
 * - src/components/resource-planning/PipelineTimelineView.tsx (.eq('resource_type', 'active'))
 * - src/components/resources/dialogs/ResourceAllocationDialog.tsx (dynamic resource_type based on member.type)
 * - src/components/workload/hooks/services/dataFetchers.ts (.eq('resource_type', 'active'))
 * - src/components/weekly-rundown/cards/AvailableThisWeekCard.tsx (intentionally fetches both types for combined availability view)
 * - src/hooks/useProjectStageProgress.ts (.eq('resource_type', 'active'))
 * - src/hooks/project-financial/useBurnRateTracking.ts (.eq('resource_type', 'active'))
 * - src/pages/ProjectResourcing/hooks/useProjectResourcingSummary.ts (.eq('resource_type', 'active'))
 * - src/pages/WeeklyOverview/hooks/useWeeklyOverviewData.ts (.eq('resource_type', 'active'))
 * - src/pages/CapacityHeatmap.tsx (.eq('resource_type', 'active'))
 * - src/services/unifiedInsightsService.ts (.eq('resource_type', 'active'))
 * - src/components/projects/services/matrixImporter.ts (bulk import uses direct DB with proper resource_type='active')
 *
 * === WRITE PATHS USING CANONICAL API ===
 * - src/components/resources/person-view/ProjectAllocationRow.tsx (uses saveResourceAllocation)
 * - src/components/resources/person-view/AddProjectRow.tsx (uses saveResourceAllocation)
 * - src/components/resources/hooks/services/resourceDeletionService.ts (uses deleteAllResourceAllocationsForProject)
 * - src/components/resources/dialogs/ResourceAllocationDialog.tsx (uses canonical save/remove)
 * - src/components/shared/UnifiedAddProjectPopup.tsx (uses saveResourceAllocation)
 * 
 * === SPECIAL CASES (documented exceptions) ===
 * - src/components/projects/services/matrixImporter.ts (bulk import uses direct DB with proper resource_type + unique constraint protection)
 * - src/components/resources/hooks/services/allocationService.ts (project-level view intentionally fetches all resource types)
 * - src/components/resources/hooks/useFetchResources.ts (orphan detection needs all resource types)
 */

/**
 * Development-only warning when duplicate allocations are detected in fetched data.
 * This helps catch regressions during development.
 */
export function warnIfDuplicateAllocations(
  allocations: Array<{ resource_id: string; project_id?: string; allocation_date: string; id?: string }>,
  context: string
): void {
  if (process.env.NODE_ENV === 'production') return;

  const seen = new Map<string, string[]>();
  
  for (const alloc of allocations) {
    const key = `${alloc.resource_id}|${alloc.project_id || 'unknown'}|${alloc.allocation_date}`;
    const ids = seen.get(key) || [];
    ids.push(alloc.id || 'no-id');
    seen.set(key, ids);
  }

  const duplicates = Array.from(seen.entries()).filter(([, ids]) => ids.length > 1);
  
  if (duplicates.length > 0) {
    console.warn(
      `[RULE BOOK VIOLATION] ${context}: Found ${duplicates.length} duplicate allocation groups.`,
      duplicates.slice(0, 3).map(([key, ids]) => ({ key, ids }))
    );
  }
}

/**
 * Validates that an allocation date is on the expected week start day.
 */
export function validateWeekStart(
  allocationDate: string,
  expectedDayOfWeek: 0 | 1 | 6, // 0=Sunday, 1=Monday, 6=Saturday
  context: string
): boolean {
  const date = new Date(allocationDate + 'T00:00:00');
  const actualDow = date.getUTCDay();
  
  if (actualDow !== expectedDayOfWeek) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[RULE BOOK VIOLATION] ${context}: allocation_date ${allocationDate} is not on expected week start day (expected ${expectedDayOfWeek}, got ${actualDow})`
      );
    }
    return false;
  }
  
  return true;
}
