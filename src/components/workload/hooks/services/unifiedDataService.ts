import { format } from 'date-fns';
import { initializeWorkloadResult } from './workloadDataInitializer';
import { fetchProjectAllocations, fetchAnnualLeaves, fetchOtherLeaves } from './dataFetchers';
import { processProjectAllocations, processAnnualLeaves, processOtherLeaves, calculateTotals } from './dataProcessors';
import { UnifiedWorkloadParams, UnifiedWorkloadResult, WeeklyBreakdown } from './types';

// Re-export types for backward compatibility
export type { UnifiedWorkloadParams, UnifiedWorkloadResult, WeeklyBreakdown };

export const fetchUnifiedWorkloadData = async (params: UnifiedWorkloadParams): Promise<UnifiedWorkloadResult> => {
  const { companyId, members, startDate, numberOfWeeks } = params;
  
  console.log('🔄 UNIFIED DATA SERVICE: Fetching workload data with STANDARDIZED logic', {
    companyId,
    memberCount: members.length,
    startDate: format(startDate, 'yyyy-MM-dd'),
    numberOfWeeks,
    viewType: `${numberOfWeeks}-week-unified`
  });

  const memberIds = members.map(m => m.id);

  try {
    // Initialize result structure with all weeks
    const result = initializeWorkloadResult(members, startDate, numberOfWeeks);

    // Calculate date range
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (numberOfWeeks * 7) - 1);

    // Fetch ALL data in parallel - SINGLE DATA FETCH POINT
    const [projectAllocations, annualLeaves, otherLeaves] = await Promise.all([
      fetchProjectAllocations(companyId, memberIds, startDate, endDate),
      fetchAnnualLeaves(companyId, memberIds, startDate, endDate),
      fetchOtherLeaves(companyId, memberIds, startDate, endDate)
    ]);

    console.log('🔄 UNIFIED DATA SERVICE: Raw data fetched:', {
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

    console.log('🔄 UNIFIED DATA SERVICE: Processing complete', {
      membersWithData: Object.keys(result).filter(memberId => 
        Object.values(result[memberId]).some(week => week.total > 0)
      ).length,
      totalMembers: Object.keys(result).length,
      numberOfWeeks,
      viewType: `${numberOfWeeks}-week-unified`
    });

    return result;

  } catch (error) {
    console.error('🔄 UNIFIED DATA SERVICE: Error in fetchUnifiedWorkloadData:', error);
    throw error;
  }
};