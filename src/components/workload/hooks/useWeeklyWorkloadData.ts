
import { useQuery } from '@tanstack/react-query';
import { useCompany } from '@/context/CompanyContext';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { fetchProjectAllocations, processProjectAllocations } from './services/projectAllocationsService';
import { fetchAnnualLeave, processAnnualLeave } from './services/annualLeaveService';
import { fetchOtherLeave, processOtherLeave } from './services/otherLeaveService';
import { initializeWorkloadData, generateWeekStartDates, debugWorkloadData } from './utils/workloadDataUtils';

// Export the type for use in other components - using export type for isolatedModules compatibility
export type { WeeklyWorkloadBreakdown } from './types';

export const useWeeklyWorkloadData = (
  startDate: Date,
  members: TeamMember[],
  numberOfWeeks: number = 12
) => {
  const { company } = useCompany();

  const { data: weeklyWorkloadData = {}, isLoading, error } = useQuery({
    queryKey: ['weekly-workload-data', company?.id, members.map(m => m.id), format(startDate, 'yyyy-MM-dd'), numberOfWeeks],
    queryFn: async () => {
      if (!company?.id || members.length === 0) {
        console.log('Skipping workload data fetch - no company or members');
        return {};
      }

      const memberIds = members.map(m => m.id);
      const params = {
        companyId: company.id,
        memberIds,
        startDate,
        numberOfWeeks
      };

      console.log('🔍 WORKLOAD DATA FETCH: Starting comprehensive workload data fetch:', {
        companyId: company.id,
        memberIds: memberIds.length,
        memberSample: memberIds.slice(0, 3),
        startDate: format(startDate, 'yyyy-MM-dd'),
        numberOfWeeks
      });

      // Initialize the result structure
      const result = initializeWorkloadData(members, startDate, numberOfWeeks);

      try {
        // Fetch all data in parallel
        console.log('🔍 WORKLOAD DATA FETCH: Fetching all data sources...');
        const [allocations, annualLeaves, otherLeaves] = await Promise.all([
          fetchProjectAllocations(params),
          fetchAnnualLeave(params),
          fetchOtherLeave(params)
        ]);

        console.log('🔍 WORKLOAD DATA FETCH: Raw data received:', {
          allocations: allocations.length,
          annualLeaves: annualLeaves.length,
          otherLeaves: otherLeaves.length
        });

        // Log sample allocation data if available
        if (allocations.length > 0) {
          console.log('🔍 WORKLOAD DATA FETCH: Sample allocation:', {
            resource_id: allocations[0].resource_id,
            hours: allocations[0].hours,
            week_start_date: allocations[0].week_start_date,
            project_name: allocations[0].projects?.name
          });
        } else {
          console.log('🔍 WORKLOAD DATA FETCH: No project allocations found!');
          
          // Debug: Check what's in the database
          console.log('🔍 WORKLOAD DATA DEBUG: Query parameters used:', {
            companyId: company.id,
            memberIds,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDateCalculated: format(new Date(startDate.getTime() + (numberOfWeeks * 7 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd')
          });
        }

        // Process all data
        console.log('🔍 WORKLOAD DATA FETCH: Processing data...');
        processProjectAllocations(allocations, result);
        processAnnualLeave(annualLeaves, result);
        processOtherLeave(otherLeaves, result);

        // Debug logging
        debugWorkloadData(members, result, allocations);

        // Final verification
        const membersWithProjectHours = Object.keys(result).filter(memberId => {
          return Object.values(result[memberId]).some(week => week.projectHours > 0);
        });
        
        console.log('🔍 WORKLOAD DATA FETCH: Final summary:', {
          totalMembers: Object.keys(result).length,
          membersWithProjectHours: membersWithProjectHours.length,
          sampleProjectHours: membersWithProjectHours.slice(0, 3).map(memberId => ({
            memberId,
            totalProjectHours: Object.values(result[memberId]).reduce((sum, week) => sum + week.projectHours, 0)
          }))
        });

        return result;
      } catch (error) {
        console.error('🔍 WORKLOAD DATA FETCH: Error processing workload data:', error);
        throw error;
      }
    },
    enabled: !!company?.id && members.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate week start dates for the calendar
  const weekStartDates = generateWeekStartDates(startDate, numberOfWeeks);

  return {
    weeklyWorkloadData,
    isLoading,
    isLoadingWorkload: isLoading, // Add alias for compatibility
    error,
    weekStartDates
  };
};
