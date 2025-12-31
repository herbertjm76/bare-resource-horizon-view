import { format, startOfWeek, parseISO } from 'date-fns';
import { UnifiedWorkloadResult } from './types';
import { logger } from '@/utils/logger';

export const processProjectAllocations = (
  allocationsData: any[],
  result: UnifiedWorkloadResult
) => {
  if (!allocationsData || allocationsData.length === 0) return;

  logger.debug('🔍 PROCESSING PROJECT ALLOCATIONS:', {
    totalAllocations: allocationsData.length,
    sampleAllocations: allocationsData.slice(0, 3).map(a => ({
      resource_id: a.resource_id,
      hours: a.hours,
      allocation_date: a.allocation_date,
      project_id: a.project_id
    }))
  });

  const memberWeekHours = new Map<string, Map<string, number>>();
  const memberWeekProjects = new Map<string, Map<string, Map<string, any>>>();
  const debugProcessedRecords: any[] = [];

  for (const allocation of allocationsData) {
    const memberId = allocation.resource_id;
    const hours = typeof allocation.hours === 'string' ? parseFloat(allocation.hours) || 0 : allocation.hours || 0;
    const projectId = allocation.project_id;
    
    // Use allocation_date field (not week_start_date)
    const dateStr = allocation.allocation_date;
    if (!dateStr) continue; // Skip if no date
    
    const allocationDate = parseISO(dateStr);
    const allocationWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 });
    const weekKey = format(allocationWeekStart, 'yyyy-MM-dd');
    
    // Debug specific members (Rob Night + Paul Julius)
    if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e' || memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82') {
      debugProcessedRecords.push({
        memberId,
        memberName: memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' ? 'Paul Julius' : 'Rob Night',
        originalWeekStart: allocation.week_start_date,
        parsedDate: allocationDate.toISOString(),
        normalizedWeekStart: allocationWeekStart.toISOString(),
        weekKey,
        hours,
        projectId,
        projectName: allocation.projects?.name
      });
    }
    
    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
      memberWeekProjects.set(memberId, new Map());
    }
    if (!memberWeekProjects.get(memberId)!.has(weekKey)) {
      memberWeekProjects.get(memberId)!.set(weekKey, new Map());
    }

    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
    
    const projectsMap = memberWeekProjects.get(memberId)!.get(weekKey)!;
    const existingProject = projectsMap.get(projectId);
    
    if (existingProject) {
      existingProject.hours += hours;
    } else {
      projectsMap.set(projectId, {
        project_id: projectId,
        project_name: allocation.projects?.name || 'Unknown Project',
        project_code: allocation.projects?.code || 'N/A',
        hours: hours
      });
    }
  }

  // Log debug info for tracked members
  if (debugProcessedRecords.length > 0) {
    logger.debug('🔍 ALLOCATION PROCESSING DEBUG:', {
      totalRecords: debugProcessedRecords.length,
      records: debugProcessedRecords,
      paulJuliusWeeklyTotals: Array.from(memberWeekHours.get('b06b0c9d-70c5-49cd-aae9-fcf9016ebe82')?.entries() || []),
      robNightWeeklyTotals: Array.from(memberWeekHours.get('fc351fa0-b6df-447a-bc27-b6675db2622e')?.entries() || [])
    });
  }

  // Update result with project data - with date range validation
  memberWeekHours.forEach((weekMap, memberId) => {
    weekMap.forEach((totalHours, weekKey) => {
      // Only update weeks that exist in the result structure (within the requested date range)
      if (result[memberId] && result[memberId][weekKey]) {
        result[memberId][weekKey].projectHours = totalHours;
        const projectsMap = memberWeekProjects.get(memberId)?.get(weekKey);
        result[memberId][weekKey].projects = projectsMap ? Array.from(projectsMap.values()) : [];
        
        // Debug tracked members' week updates  
        if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e' || memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82') {
          logger.debug('🔍 UPDATING MEMBER WEEK:', {
            memberName: memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' ? 'Paul Julius' : 'Rob Night',
            weekKey,
            totalHours,
            existsInResult: !!result[memberId][weekKey],
            finalData: result[memberId][weekKey]
          });
        }
      } else {
        // Debug weeks that fall outside the requested date range
        if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e' || memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82') {
          logger.debug('🔍 MEMBER WEEK OUTSIDE DATE RANGE (FILTERED OUT):', {
            memberName: memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' ? 'Paul Julius' : 'Rob Night',
            weekKey,
            totalHours,
            memberExists: !!result[memberId],
            availableWeeks: result[memberId] ? Object.keys(result[memberId]) : [],
            reason: 'Week falls outside requested date range'
          });
        }
      }
    });
  });
};

export const processAnnualLeaves = (
  leavesData: any[],
  result: UnifiedWorkloadResult
) => {
  if (!leavesData || leavesData.length === 0) return;

  const memberWeekHours = new Map<string, Map<string, number>>();

  for (const leave of leavesData) {
    const memberId = leave.member_id;
    const leaveDate = new Date(leave.date);
    const hours = typeof leave.hours === 'string' ? parseFloat(leave.hours) || 0 : leave.hours || 0;
    
    const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
    const weekKey = format(weekStart, 'yyyy-MM-dd');

    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
    }

    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
  }

  // Update result with annual leave data
  memberWeekHours.forEach((weekMap, memberId) => {
    weekMap.forEach((totalHours, weekKey) => {
      if (result[memberId] && result[memberId][weekKey]) {
        result[memberId][weekKey].annualLeave = totalHours;
      }
    });
  });
};

export const processOtherLeaves = (
  leavesData: any[],
  result: UnifiedWorkloadResult
) => {
  if (!leavesData || leavesData.length === 0) return;

  const memberWeekHours = new Map<string, Map<string, number>>();

  for (const leave of leavesData) {
    const memberId = leave.member_id;
    const weekStartDate = new Date(leave.week_start_date);
    const weekKey = format(weekStartDate, 'yyyy-MM-dd');
    const hours = typeof leave.hours === 'string' ? parseFloat(leave.hours) || 0 : leave.hours || 0;

    if (!memberWeekHours.has(memberId)) {
      memberWeekHours.set(memberId, new Map());
    }

    const currentHours = memberWeekHours.get(memberId)!.get(weekKey) || 0;
    memberWeekHours.get(memberId)!.set(weekKey, currentHours + hours);
  }

  // Update result with other leave data
  memberWeekHours.forEach((weekMap, memberId) => {
    weekMap.forEach((totalHours, weekKey) => {
      if (result[memberId] && result[memberId][weekKey]) {
        result[memberId][weekKey].otherLeave = totalHours;
      }
    });
  });
};

export const calculateTotals = (result: UnifiedWorkloadResult) => {
  logger.debug('🔍 CALCULATE TOTALS: Starting calculation');
  let updatedCount = 0;
  
  Object.keys(result).forEach(memberId => {
    Object.keys(result[memberId]).forEach(weekKey => {
      const breakdown = result[memberId][weekKey];
      const oldTotal = breakdown.total;
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
      
      // Debug for Paul Julius on specific weeks
      if (memberId === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' && breakdown.total > 0) {
        logger.debug('🔍 CALCULATE TOTALS - Paul Julius:', {
          weekKey,
          projectHours: breakdown.projectHours,
          annualLeave: breakdown.annualLeave,
          oldTotal,
          newTotal: breakdown.total
        });
        updatedCount++;
      }
    });
  });
  
  logger.debug('🔍 CALCULATE TOTALS: Complete', { 
    totalMembers: Object.keys(result).length,
    paulJuliusWeeksUpdated: updatedCount
  });
};