
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

      console.log('Fetching workload data for:', {
        companyId: company.id,
        memberIds: memberIds.length,
        startDate: format(startDate, 'yyyy-MM-dd'),
        numberOfWeeks
      });

      // Initialize the result structure
      const result = initializeWorkloadData(members, startDate, numberOfWeeks);

      try {
        // Fetch all data in parallel
        const [allocations, annualLeaves, otherLeaves] = await Promise.all([
          fetchProjectAllocations(params),
          fetchAnnualLeave(params),
          fetchOtherLeave(params)
        ]);

        // Process all data
        processProjectAllocations(allocations, result);
        processAnnualLeave(annualLeaves, result);
        processOtherLeave(otherLeaves, result);

        // Debug logging
        debugWorkloadData(members, result, allocations);

        return result;
      } catch (error) {
        console.error('Error processing workload data:', error);
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
