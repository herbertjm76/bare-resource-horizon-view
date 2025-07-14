import { format, startOfWeek, parseISO } from 'date-fns';
import { UnifiedWorkloadResult } from './types';

export const processProjectAllocations = (
  allocationsData: any[],
  result: UnifiedWorkloadResult
) => {
  if (!allocationsData || allocationsData.length === 0) return;

  console.log('🔍 PROCESSING PROJECT ALLOCATIONS:', {
    totalAllocations: allocationsData.length,
    sampleAllocations: allocationsData.slice(0, 3).map(a => ({
      resource_id: a.resource_id,
      hours: a.hours,
      week_start_date: a.week_start_date,
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
    
    const allocationDate = parseISO(allocation.week_start_date);
    const allocationWeekStart = startOfWeek(allocationDate, { weekStartsOn: 1 });
    const weekKey = format(allocationWeekStart, 'yyyy-MM-dd');
    
    // Debug specific member (Rob Night's ID from logs)
    if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e') {
      debugProcessedRecords.push({
        originalWeekStart: allocation.week_start_date,
        parsedDate: allocationDate.toISOString(),
        normalizedWeekStart: allocationWeekStart.toISOString(),
        weekKey,
        hours,
        projectId
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

  // Log debug info for Rob Night
  if (debugProcessedRecords.length > 0) {
    console.log('🔍 ROB NIGHT ALLOCATION PROCESSING:', {
      totalRecords: debugProcessedRecords.length,
      records: debugProcessedRecords,
      weeklyTotals: Array.from(memberWeekHours.get('fc351fa0-b6df-447a-bc27-b6675db2622e')?.entries() || [])
    });
  }

  // Update result with project data
  memberWeekHours.forEach((weekMap, memberId) => {
    weekMap.forEach((totalHours, weekKey) => {
      if (result[memberId] && result[memberId][weekKey]) {
        result[memberId][weekKey].projectHours = totalHours;
        const projectsMap = memberWeekProjects.get(memberId)?.get(weekKey);
        result[memberId][weekKey].projects = projectsMap ? Array.from(projectsMap.values()) : [];
        
        // Debug Rob Night's week updates  
        if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e') {
          console.log('🔍 UPDATING ROB NIGHT WEEK:', {
            weekKey,
            totalHours,
            existsInResult: !!result[memberId][weekKey],
            finalData: result[memberId][weekKey]
          });
        }
      } else {
        // Debug missing weeks
        if (memberId === 'fc351fa0-b6df-447a-bc27-b6675db2622e') {
          console.log('🔍 ROB NIGHT WEEK NOT FOUND IN RESULT:', {
            weekKey,
            totalHours,
            memberExists: !!result[memberId],
            availableWeeks: result[memberId] ? Object.keys(result[memberId]).slice(0, 5) : 'none'
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
  Object.keys(result).forEach(memberId => {
    Object.keys(result[memberId]).forEach(weekKey => {
      const breakdown = result[memberId][weekKey];
      breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
    });
  });
};