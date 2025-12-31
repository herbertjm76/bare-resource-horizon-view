import { useQuery } from '@tanstack/react-query';
import { useCompany } from '@/context/CompanyContext';
import { format, addWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { fetchUnifiedWorkloadData, UnifiedWorkloadResult } from './services/unifiedDataService';
import { useAppSettings, WeekStartDay } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { logger } from '@/utils/logger';

// Generate week start dates for the calendar based on company week start preference
export const generateWeekStartDates = (startDate: Date, numberOfWeeks: number, weekStartDay: WeekStartDay = 'Monday') => {
  const weekStartDates = [];
  const normalizedStartDate = getWeekStartDate(startDate, weekStartDay);
  
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
  const { startOfWorkWeek } = useAppSettings();

  logger.debug('🔄 UNIFIED HOOK: Called with parameters', {
    startDate: format(startDate, 'yyyy-MM-dd'),
    memberCount: members.length,
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`,
    companyId: company?.id,
    weekStartDay: startOfWorkWeek
  });

  const { data: workloadData = {}, isLoading, error } = useQuery<UnifiedWorkloadResult>({
    queryKey: ['unified-workload-data-v2', company?.id, members.map(m => m.id).sort(), format(startDate, 'yyyy-MM-dd'), numberOfWeeks, startOfWorkWeek],
    queryFn: async () => {
      if (!company?.id || members.length === 0) {
        logger.debug('🔄 UNIFIED HOOK: Skipping fetch - no company or members');
        return {};
      }

      logger.debug('🚨🚨🚨 CRITICAL - QUERY FUNCTION EXECUTING 🚨🚨🚨', {
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
        numberOfWeeks,
        weekStartDay: startOfWorkWeek
      });
    },
    enabled: !!company?.id && members.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes - data stays fresh
    gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache
  });

  // Generate week start dates for the calendar using company preference
  const weekStartDates = generateWeekStartDates(startDate, numberOfWeeks, startOfWorkWeek);

  logger.debug('🔄 UNIFIED HOOK: Returning data', {
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