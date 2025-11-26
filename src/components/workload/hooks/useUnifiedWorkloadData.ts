import { useQuery } from '@tanstack/react-query';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { fetchUnifiedWorkloadData, UnifiedWorkloadResult } from './services/unifiedDataService';

// Generate week start dates for the calendar
export const generateWeekStartDates = (startDate: Date, numberOfWeeks: number) => {
  const weekStartDates = [];
  const normalizedStartDate = startOfWeek(startDate, { weekStartsOn: 1 }); // Ensure Monday start
  
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekDate = addWeeks(normalizedStartDate, i);
    weekStartDates.push({
      date: weekDate,
      key: format(weekDate, 'yyyy-MM-dd')
    });
  }
  
  return weekStartDates;
};

export const useUnifiedWorkloadData = (
  startDate: Date,
  members: TeamMember[],
  numberOfWeeks: number = 12
) => {
  const { company } = useCompany();

  console.log('🔄 UNIFIED HOOK: Called with parameters', {
    startDate: format(startDate, 'yyyy-MM-dd'),
    memberCount: members.length,
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`,
    companyId: company?.id
  });

  const { data: workloadData = {}, isLoading, error } = useQuery<UnifiedWorkloadResult>({
    queryKey: ['unified-workload-data-v2', company?.id, members.map(m => m.id).sort(), format(startDate, 'yyyy-MM-dd'), numberOfWeeks],
    queryFn: async () => {
      if (!company?.id || members.length === 0) {
        console.log('🔄 UNIFIED HOOK: Skipping fetch - no company or members');
        return {};
      }

      console.log('🚨🚨🚨 CRITICAL - QUERY FUNCTION EXECUTING 🚨🚨🚨', {
        companyId: company.id,
        startDate: format(startDate, 'yyyy-MM-dd'),
        numberOfWeeks,
        memberCount: members.length,
        viewType: `${numberOfWeeks}-week-unified`
      });

      return fetchUnifiedWorkloadData({
        companyId: company.id,
        members,
        startDate,
        numberOfWeeks
      });
    },
    enabled: !!company?.id && members.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
  });

  // Generate week start dates for the calendar
  const weekStartDates = generateWeekStartDates(startDate, numberOfWeeks);

  console.log('🔄 UNIFIED HOOK: Returning data', {
    hasData: Object.keys(workloadData).length > 0,
    memberCount: Object.keys(workloadData).length,
    weekCount: weekStartDates.length,
    isLoading,
    hasError: !!error,
    viewType: `${numberOfWeeks}-week-unified`
  });

  return {
    weeklyWorkloadData: workloadData,
    isLoading,
    error,
    weekStartDates
  };
};