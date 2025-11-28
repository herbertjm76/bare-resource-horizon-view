# Database Migration Status: week_start_date → allocation_date

## Migration Completed ✅
- Database column `week_start_date` renamed to `allocation_date`
- Database view `weekly_resource_allocations` created for weekly aggregations

## Code Updates Required

### Type Definitions to Update
All TypeScript interfaces that reference `week_start_date` need to be updated to `allocation_date`:

1. `src/hooks/allocations/types.ts` - ResourceAllocation interface
2. `src/hooks/utilization/types.ts` - MemberAllocation interface  
3. `src/hooks/allocations/utils/processingUtils.ts` - AllocationItem interface
4. `src/hooks/useCustomCards.ts` - CustomCardEntry interface

### Query Files to Update
All Supabase queries using `week_start_date` in SELECT/WHERE clauses:

1. ✅ `src/hooks/allocations/api.ts` - DONE
2. ✅ `src/components/dashboard/staff/useStaffAllocations.ts` - DONE  
3. ✅ `src/components/projects/services/matrixImporter.ts` - DONE
4. ✅ `src/components/resources/dialogs/ResourceAllocationDialog.tsx` - DONE
5. ✅ `src/components/resources/hooks/services/allocationService.ts` - DONE
6. ✅ `src/components/team-member-detail/TeamMemberProjectAllocations.tsx` - DONE
7. ✅ `src/components/team-member-detail/TeamMemberProjectOverview.tsx` - DONE
8. ✅ `src/components/week-resourcing/hooks/useDetailedWeeklyAllocations.ts` - DONE
9. ✅ `src/components/week-resourcing/hooks/useWeekResourceAllocations.ts` - DONE
10. ✅ `src/components/weekly-rundown/AddProjectAllocation.tsx` - DONE
11. ✅ `src/components/weekly-rundown/AddTeamMemberAllocation.tsx` - DONE
12. ✅ `src/components/weekly-rundown/AvailableMembersRow.tsx` - DONE
13. ✅ `src/components/workload/hooks/services/dataFetchers.ts` - DONE

### Remaining Files with Errors
- `src/hooks/allocations/utils/fetchUtils.ts`
- `src/hooks/project-financial/useBurnRateTracking.ts`
- `src/hooks/queries/useDashboardQueries.ts`
- `src/hooks/useIndividualMemberUtilization.ts`
- `src/hooks/usePersonResourceData.ts`
- `src/hooks/useProjectStageProgress.ts`
- `src/hooks/useStandardizedUtilizationData.ts`
- `src/hooks/useTeamUtilization.ts`
- `src/hooks/utilization/useActiveMembers.ts`
- `src/hooks/utilization/usePreRegisteredMembers.ts`
- `src/components/team-member-detail/TeamMemberInsightsGrid.tsx`
- `src/components/weekly-rundown/EditableProjectAllocation.tsx`
- `src/components/weekly-rundown/EditableTeamMemberAllocation.tsx`
- `src/components/weekly-rundown/OtherLeaveSection.tsx`
- `src/components/weekly-rundown/TeamMemberAvatar.tsx`
- `src/components/week-resourcing/hooks/useComprehensiveAllocations.ts`
- `src/components/dashboard/hooks/useIndividualUtilization.ts`
- `src/components/dashboard/hooks/useResourceAllocationData.ts`
- `src/components/profile/overview/hooks/useUserProjects.ts`
- `src/components/team-member-detail/resource-planning/hooks/useResourcePlanningData.ts`
- `src/components/team-member-detail/resource-planning/utils/resourcePlanningCalculations.ts`
- `src/pages/TeamWorkload.tsx`
- `src/pages/ProjectResourcing/hooks/useProjectResourcingSummary.ts`

## Next Steps
Update all remaining files to use `allocation_date` instead of `week_start_date` in:
1. Database queries (SELECT, WHERE clauses)
2. Type interfaces
3. Property access (obj.week_start_date → obj.allocation_date)
