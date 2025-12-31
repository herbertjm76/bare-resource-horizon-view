import { format } from 'date-fns';
import { initializeWorkloadResult } from './workloadDataInitializer';
import { fetchProjectAllocations, fetchAnnualLeaves, fetchOtherLeaves } from './dataFetchers';
import { processProjectAllocations, processAnnualLeaves, processOtherLeaves, calculateTotals } from './dataProcessors';
import { UnifiedWorkloadParams, UnifiedWorkloadResult, WeeklyBreakdown } from './types';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { logger } from '@/utils/logger';

// Re-export types for backward compatibility
export type { UnifiedWorkloadParams, UnifiedWorkloadResult, WeeklyBreakdown };

export const fetchUnifiedWorkloadData = async (params: UnifiedWorkloadParams): Promise<UnifiedWorkloadResult> => {
  const { companyId, members, startDate, numberOfWeeks, weekStartDay = 'Monday' } = params;
  
  logger.debug('🔄 UNIFIED DATA SERVICE: Fetching workload data with STANDARDIZED logic', {
    companyId,
    memberCount: members.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    weekStartDay,
    viewType: `${numberOfWeeks}-week-unified`
  });

  const memberIds = members.map(m => m.id);

  try {
    // Calculate date range with proper week normalization based on company settings
    const normalizedStartDate = getWeekStartDate(startDate, weekStartDay);
    const endDate = new Date(normalizedStartDate);
    endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);
    
    logger.debug('🔄 UNIFIED DATA SERVICE: Date range calculation', {
      originalStartDate: format(startDate, 'yyyy-MM-dd'),
      normalizedStartDate: format(normalizedStartDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      numberOfWeeks,
      weekStartDay,
      viewType: `${numberOfWeeks}-week-unified`
    });

    // Initialize result structure with all weeks using normalized start date
    const result = initializeWorkloadResult(members, normalizedStartDate, numberOfWeeks);

    // Fetch ALL data in parallel - SINGLE DATA FETCH POINT
    const [projectAllocations, annualLeaves, otherLeaves] = await Promise.all([
      fetchProjectAllocations(companyId, memberIds, normalizedStartDate, endDate),
      fetchAnnualLeaves(companyId, memberIds, normalizedStartDate, endDate),
      fetchOtherLeaves(companyId, memberIds, normalizedStartDate, endDate)
    ]);

    logger.debug('🔄 UNIFIED DATA SERVICE: Raw data fetched:', {
      projectAllocations: projectAllocations.data?.length || 0,
      annualLeaves: annualLeaves.data?.length || 0,
      otherLeaves: otherLeaves.data?.length || 0
    });

    // Process all data types
    processProjectAllocations(projectAllocations.data || [], result);
    processAnnualLeaves(annualLeaves.data || [], result);
    processOtherLeaves(otherLeaves.data || [], result);

    // Calculate totals for all members and weeks
    calculateTotals(result);

    logger.debug('🔄 UNIFIED DATA SERVICE: Processing complete', {
      membersWithData: Object.keys(result).filter(memberId => 
        Object.values(result[memberId]).some(week => week.total > 0)
      ).length,
      totalMembers: Object.keys(result).length,
      numberOfWeeks,
      viewType: `${numberOfWeeks}-week-unified`,
      detailedMemberBreakdown: Object.keys(result).reduce((acc, memberId) => {
        const memberWeeks = result[memberId];
        const totalHours = Object.values(memberWeeks).reduce((sum, week) => sum + week.total, 0);
        const weeksWithData = Object.values(memberWeeks).filter(week => week.total > 0).length;
        acc[memberId] = {
          totalHours,
          weeksWithData,
          weekCount: Object.keys(memberWeeks).length,
          firstWeek: Object.keys(memberWeeks)[0],
          lastWeek: Object.keys(memberWeeks)[Object.keys(memberWeeks).length - 1]
        };
        return acc;
      }, {} as any)
    });

    return result;

  } catch (error) {
    logger.error('🔄 UNIFIED DATA SERVICE: Error in fetchUnifiedWorkloadData:', error);
    throw error;
  }
};