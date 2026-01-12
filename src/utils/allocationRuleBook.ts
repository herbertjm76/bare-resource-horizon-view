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
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  WEEK START ALIGNMENT RULES                                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ALL views MUST respect the company's `start_of_work_week` setting:
 * 
 * 1. Use `useAppSettings()` hook to get `startOfWorkWeek` from company settings
 * 2. Use canonical week utilities from `src/utils/allocationWeek.ts`:
 *    - `getAllocationWeekKey(date, weekStartDay)` for generating week keys
 *    - `getWeekRange(weekKey)` for week boundaries
 *    - `generateWeekKeysForPeriod(startDate, weekCount, weekStartDay)` for multi-week ranges
 * 3. For date-fns usage, convert weekStartDay to weekStartsOn:
 *    - 'Sunday' → 0, 'Saturday' → 6, 'Monday' → 1
 * 4. NEVER hardcode `weekStartsOn: 1` - always derive from company settings
 * 
 * FILES AUDITED FOR WEEK START ALIGNMENT:
 * - src/pages/WeeklyOverview/hooks/useWeeklyOverviewData.ts ✅ (uses getWeekStartDate from weekNormalization)
 * - src/components/week-resourcing/hooks/useStreamlinedWeekResourceData.ts ✅ (uses getWeekStartDate from weekNormalization)
 * - src/components/week-resourcing/hooks/useDetailedWeeklyAllocations.ts ✅ (uses getWeekStartDate from weekNormalization)
 * - src/components/weekly-rundown/AvailableMembersRow.tsx ✅ (uses getAllocationWeekKey)
 * - src/pages/ProjectResourcing/hooks/useProjectResourcingSummary.ts ✅ (uses startOfWorkWeek)
 * - src/pages/ProjectResourcing/hooks/useProjectResourcingState.ts ✅ (uses getWeekStartsOn helper)
 * - src/hooks/allocations/utils/fetchUtils.ts ✅ (uses getAllocationWeekKey)
 * - src/hooks/allocations/useFetchAllocations.ts ✅ (uses getAllocationWeekKey)
 * 
 * CRITICAL DATE HANDLING RULE:
 * - ALL week date calculations MUST use `getWeekStartDate` from `@/utils/weekNormalization`
 * - NEVER use date-fns startOfWeek directly for allocation queries (it's timezone-sensitive)
 * - The UTC-based weekNormalization ensures consistency across all views regardless of user timezone
 * - src/components/weekly-overview/utils.ts has a timezone-sensitive version - DO NOT USE for allocations
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  RESOURCE TYPE RULES                                                          ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * resource_type determines whether an allocation belongs to an active or pending member:
 * 
 * - 'active'         → Member exists in `profiles` table (accepted invite, real user)
 * - 'pre_registered' → Member exists in `invites` table with status='pending' (not yet accepted)
 * 
 * CRITICAL RULES:
 * 1. When SAVING allocations, callers MUST pass the correct resource_type based on member status
 * 2. Pre-registered members should NEVER have resource_type='active' allocations
 * 3. Active members should NEVER have resource_type='pre_registered' allocations
 * 4. When a member accepts their invite:
 *    - Their profile is created in `profiles` table
 *    - Their allocations migrate from pre_registered → active (handled by handle_new_user trigger)
 *    - The invite status changes to 'accepted'
 * 
 * HOW TO DETERMINE resource_type IN CODE:
 * - If resource_id exists in profiles → 'active'
 * - If resource_id exists in invites with status='pending' → 'pre_registered'
 * - UI components should track isPending/type on member objects
 *
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  RESOURCE NAMING CONVENTION                                                   ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ALL members/resources MUST display a meaningful name. NEVER show "Unnamed".
 * 
 * Priority order for display name:
 * 1. `${first_name} ${last_name}`.trim() - if profile/invite has name data
 * 2. For pending/pre-registered: "Pending invite" 
 * 3. For orphaned allocations (deleted profile/invite): "Deleted Resource"
 * 4. As absolute last resort: Use email prefix or ID-based identifier
 * 
 * The word "Unnamed" should NEVER appear in the UI. It indicates a bug.
 * 
 * CANONICAL WRITE FUNCTIONS (src/hooks/allocations/api.ts):
 * - saveResourceAllocation(): Save/update a single week's allocation
 * - deleteResourceAllocation(): Delete a single week's allocation
 * - deleteAllResourceAllocationsForProject(): Delete all allocations for a resource on a project
 * 
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  READ PATH FILTER RULES                                                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * - Active-only views (dashboards, utilization): .eq('resource_type', 'active')
 * - Pre-registered-only views: .eq('resource_type', 'pre_registered')
 * - Combined views (Weekly Overview, Resource Scheduling): .in('resource_type', ['active', 'pre_registered'])
 *   - These views show BOTH active AND pre-registered members, so they need BOTH allocation types
 *   - No double-counting occurs because each member ID is unique to either profiles OR invites
 * 
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  DATA SOURCE ALIGNMENT                                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * ALL views fetch from the SAME database table: `project_resource_allocations`
 * 
 * Weekly Overview and Resource Scheduling are "transposed views" of the same data:
 * - Weekly Overview: Rows = Members, Columns = Projects (grouped by member)
 * - Resource Scheduling: Rows = Projects, Columns = Members/Weeks (grouped by project)
 * - Both use the same allocation data, just displayed differently
 * 
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  FILTER BEHAVIOR RULES                                                        ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * The DEPARTMENT FILTER has different targets depending on the view orientation:
 * 
 * 1. BY PROJECT VIEWS (Resource Scheduling → By Project, Weekly Overview → Per Project):
 *    - Department filter targets PROJECT.department
 *    - Selecting "Hospitality" shows all Hospitality PROJECTS
 *    - Shows ALL team members allocated to those projects (regardless of member's department)
 *    - Member filters (practiceArea, location) can further filter team members WITHIN projects
 * 
 * 2. BY PERSON VIEWS (Resource Scheduling → By Person, Weekly Overview → Per Person):
 *    - Department filter targets MEMBER.department (profile.department or invite.department)
 *    - Selecting "Hospitality" shows all people IN the Hospitality department
 *    - Shows all project allocations for those filtered members
 *    - All filter types available: department, practiceArea, location
 * 
 * KEY IMPLEMENTATION DETAILS:
 * - useStreamlinedWeekResourceData accepts `isProjectOriented` option
 * - When isProjectOriented=true, member filtering is bypassed (return all members)
 * - WorkloadStyleProjectRow excludes department from member filtering (line 75)
 * - MemberFilterRow availableFilterTypes controls which filter types are shown
 * 
 * SHARED DATA SOURCES:
 * - Allocations: `project_resource_allocations` table
 * - Active members: `profiles` table (company_id filtered)
 * - Pre-registered members: `invites` table (invitation_type='pre_registered', status='pending')
 * - Projects: `projects` table (company_id filtered)
 * - Company settings: `companies` table (work_week_hours, start_of_work_week, etc.)
 * 
 * FILES THAT HAVE BEEN AUDITED AND ARE COMPLIANT:
 * 
 * === CANONICAL WRITE API (only file allowed to do direct writes) ===
 * - src/hooks/allocations/api.ts (saveResourceAllocation, deleteResourceAllocation, deleteAllResourceAllocationsForProject)
 * 
 * === COMBINED VIEWS (Weekly Overview, Resource Scheduling) - USE .in(['active', 'pre_registered']) ===
 * These pages show BOTH active AND pre-registered members side-by-side:
 * - src/hooks/allocations/utils/fetchUtils.ts ✅
 * - src/hooks/usePersonResourceData.ts ✅
 * - src/components/week-resourcing/hooks/useComprehensiveAllocations.ts ✅
 * - src/components/week-resourcing/hooks/useDetailedWeeklyAllocations.ts ✅
 * - src/components/week-resourcing/hooks/useWeekResourceAllocations.ts ✅
 * - src/pages/WeeklyOverview/hooks/useWeeklyOverviewData.ts ✅
 * - src/pages/ProjectResourcing/hooks/useProjectResourcingSummary.ts ✅
 * - src/components/weekly-rundown/AvailableMembersRow.tsx ✅
 * - src/components/workload/hooks/services/dataFetchers.ts ✅
 * - src/components/profile/overview/hooks/useUserProjects.ts ✅
 * 
 * === ACTIVE-ONLY VIEWS (Dashboards, Utilization, Metrics) - USE .eq('resource_type', 'active') ===
 * These pages measure productivity of real employees only:
 * - src/hooks/useIndividualMemberUtilization.ts
 * - src/hooks/useTeamUtilization.ts
 * - src/hooks/useStandardizedUtilizationData.ts
 * - src/hooks/utilization/useActiveMembers.ts
 * - src/hooks/queries/useDashboardQueries.ts
 * - src/components/dashboard/staff/useStaffAllocations.ts
 * - src/components/dashboard/hooks/useResourceAllocationData.ts
 * - src/components/dashboard/hooks/useIndividualUtilization.ts
 * - src/components/team-member-detail/TeamMemberProjectOverview.tsx
 * - src/components/team-member-detail/TeamMemberProjectAllocations.tsx
 * - src/components/team-member-detail/resource-planning/hooks/useResourcePlanningData.ts
 * - src/pages/CapacityHeatmap.tsx
 * - src/components/profile/overview/CapacityCard.tsx
 * - src/hooks/project-financial/useBurnRateTracking.ts
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
