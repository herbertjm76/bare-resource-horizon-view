
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

      console.log('🔍 WORKLOAD DATA: Starting workload data fetch for', memberIds.length, 'members over', numberOfWeeks, 'weeks');

      // Initialize the result structure
      const result = initializeWorkloadData(members, startDate, numberOfWeeks);

      try {
        // Fetch all data in parallel for faster loading
        const [allocations, annualLeaves, otherLeaves] = await Promise.all([
          fetchProjectAllocations(params),
          fetchAnnualLeave(params),
          fetchOtherLeave(params)
        ]);

        console.log('🔍 WORKLOAD DATA: Fetched data -', 
          'allocations:', allocations.length,
          'annual leaves:', annualLeaves.length,
          'other leaves:', otherLeaves.length
        );

        // Process all data efficiently
        processProjectAllocations(allocations, result);
        processAnnualLeave(annualLeaves, result);
        processOtherLeave(otherLeaves, result);

        // Final verification - count members with data
        const membersWithData = Object.keys(result).filter(memberId => {
          return Object.values(result[memberId]).some(week => week.total > 0);
        });
        
        console.log('🔍 WORKLOAD DATA: Processing complete -', 
          'members with data:', membersWithData.length, 
          'total members:', Object.keys(result).length
        );

        return result;
      } catch (error) {
        console.error('🔍 WORKLOAD DATA: Error processing workload data:', error);
        throw error;
      }
    },
    enabled: !!company?.id && members.length > 0,
    staleTime: 30 * 1000, // 30 seconds - reduce from 2 minutes for faster updates
    gcTime: 2 * 60 * 1000, // 2 minutes - reduce from 5 minutes
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
