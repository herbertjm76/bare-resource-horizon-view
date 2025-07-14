import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { fetchProjectAllocations, processProjectAllocations } from './projectAllocationsService';
import { fetchAnnualLeave, processAnnualLeave } from './annualLeaveService';
import { fetchOtherLeave, processOtherLeave } from './otherLeaveService';
import { WeeklyWorkloadBreakdown } from '../types';
import { initializeWorkloadResult } from './workloadDataInitializer';

export interface UnifiedWorkloadParams {
  companyId: string;
  members: TeamMember[];
  startDate: Date;
  numberOfWeeks: number;
}

export interface WeeklyBreakdown extends WeeklyWorkloadBreakdown {}

export interface UnifiedWorkloadResult {
  [memberId: string]: {
    [weekKey: string]: WeeklyBreakdown;
  };
}

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

    // Create params object for existing services
    const serviceParams = {
      companyId,
      memberIds,
      startDate,
      numberOfWeeks
    };

    // Fetch and process all data sources using existing services
    const projectAllocations = await fetchProjectAllocations(serviceParams);
    processProjectAllocations(projectAllocations, result);

    const annualLeaves = await fetchAnnualLeave(serviceParams);
    processAnnualLeave(annualLeaves, result);

    const otherLeaves = await fetchOtherLeave(serviceParams);
    processOtherLeave(otherLeaves, result);

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