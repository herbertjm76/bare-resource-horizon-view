
import { useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkloadData } from './services/workloadDataService';
import { processWorkloadData } from './utils/workloadDataProcessor';
import { generateWeekStartDates } from './utils/weekDateUtils';
import { WorkloadDataResult, WeeklyWorkloadBreakdown } from './types/weeklyWorkloadTypes';

// Re-export the type for backward compatibility
export type { WeeklyWorkloadBreakdown };

export const useWeeklyWorkloadData = (
  selectedDate: Date,
  teamMembers: TeamMember[],
  periodWeeks: number = 36
): WorkloadDataResult => {
  const { company } = useCompany();

  // Generate week start dates for the period, starting from the selected week
  const weekStartDates = useMemo(() => {
    return generateWeekStartDates(selectedDate, periodWeeks);
  }, [selectedDate, periodWeeks]);

  // Get member IDs
  const memberIds = useMemo(() => teamMembers.map(member => member.id), [teamMembers]);

  // Single comprehensive query to fetch all workload data at once
  const { data: workloadData, isLoading: isLoadingWorkload } = useQuery({
    queryKey: ['weekly-workload-comprehensive', weekStartDates.map(w => w.key), memberIds, company?.id],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const rawData = await fetchWorkloadData(company.id, memberIds, weekStartDates);
      return processWorkloadData(rawData, teamMembers, weekStartDates);
    },
    enabled: !!company?.id && memberIds.length > 0,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });

  // Return the data in the expected format
  const weeklyWorkloadData = workloadData || {};

  return { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  };
};
