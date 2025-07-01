
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
        console.log('🔍 WORKLOAD DATA: Skipping fetch - no company or members');
        return {};
      }

      const memberIds = members.map(m => m.id);
      const params = {
        companyId: company.id,
        memberIds,
        startDate,
        numberOfWeeks
      };

      console.log('🔍 WORKLOAD DATA: Starting comprehensive workload data fetch:', {
        companyId: company.id,
        memberCount: memberIds.length,
        memberIds: memberIds,
        memberNames: members.map(m => `${m.first_name} ${m.last_name}`),
        startDate: format(startDate, 'yyyy-MM-dd'),
        numberOfWeeks
      });

      // Initialize the result structure
      const result = initializeWorkloadData(members, startDate, numberOfWeeks);
      console.log('🔍 WORKLOAD DATA: Initialized result structure for members:', Object.keys(result));

      try {
        // Fetch all data in parallel
        console.log('🔍 WORKLOAD DATA: Fetching all data sources...');
        const [allocations, annualLeaves, otherLeaves] = await Promise.all([
          fetchProjectAllocations(params),
          fetchAnnualLeave(params),
          fetchOtherLeave(params)
        ]);

        console.log('🔍 WORKLOAD DATA: Raw data received:', {
          allocations: allocations.length,
          annualLeaves: annualLeaves.length,
          otherLeaves: otherLeaves.length
        });

        // Log detailed allocation data if available
        if (allocations.length > 0) {
          console.log('🔍 WORKLOAD DATA: Sample allocations:', allocations.slice(0, 3).map(a => ({
            resource_id: a.resource_id,
            hours: a.hours,
            week_start_date: a.week_start_date,
            project_name: a.projects?.name,
            resource_type: a.resource_type
          })));
        } else {
          console.log('🔍 WORKLOAD DATA: NO PROJECT ALLOCATIONS FOUND!');
          
          // Additional debugging for allocation issues
          console.log('🔍 WORKLOAD DATA: Query parameters used:', {
            companyId: company.id,
            memberIds,
            memberCount: memberIds.length,
            startDate: format(startDate, 'yyyy-MM-dd'),
            endDate: format(new Date(startDate.getTime() + (numberOfWeeks * 7 * 24 * 60 * 60 * 1000)), 'yyyy-MM-dd')
          });
        }

        // Process all data
        console.log('🔍 WORKLOAD DATA: Processing data...');
        processProjectAllocations(allocations, result);
        processAnnualLeave(annualLeaves, result);
        processOtherLeave(otherLeaves, result);

        // Debug logging
        debugWorkloadData(members, result, allocations);

        // Final verification
        const membersWithProjectHours = Object.keys(result).filter(memberId => {
          return Object.values(result[memberId]).some(week => week.projectHours > 0);
        });
        
        console.log('🔍 WORKLOAD DATA: Final summary:', {
          totalMembers: Object.keys(result).length,
          membersWithProjectHours: membersWithProjectHours.length,
          membersWithProjectHoursList: membersWithProjectHours,
          sampleProjectHours: membersWithProjectHours.slice(0, 3).map(memberId => ({
            memberId,
            memberName: members.find(m => m.id === memberId) ? 
              `${members.find(m => m.id === memberId)?.first_name} ${members.find(m => m.id === memberId)?.last_name}` : 
              'Unknown',
            totalProjectHours: Object.values(result[memberId]).reduce((sum, week) => sum + week.projectHours, 0)
          }))
        });

        return result;
      } catch (error) {
        console.error('🔍 WORKLOAD DATA: Error processing workload data:', error);
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
