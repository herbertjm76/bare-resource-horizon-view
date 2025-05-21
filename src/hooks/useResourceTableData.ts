
import { useMemo, useState } from 'react';
import { addDays, startOfWeek, isWithinInterval } from 'date-fns';
import { useAnnualLeave } from '@/hooks/useAnnualLeave';

export const useResourceTableData = (
  projects: any[],
  members: any[],
  allocations: any[],
  weekStartDate: string
) => {
  // Parse week dates for leave filtering
  const weekStart = useMemo(() => new Date(weekStartDate), [weekStartDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);
  
  // Get leave data from the annual_leave hook
  const { leaveData, isLoading: isLoadingLeave } = useAnnualLeave(weekStart);
  
  // Remarks state for manual input
  const [remarksData, setRemarksData] = useState<Record<string, string>>({});
  
  // Leave data state for sick/other leave types and notes
  const [manualLeaveData, setManualLeaveData] = useState<Record<string, Record<string, number | string>>>({});
  
  // Create members map
  const membersMap = useMemo(() => {
    const map = new Map();
    members.forEach(member => {
      map.set(member.id, member);
    });
    return map;
  }, [members]);
  
  // Organize allocations by member and project for easier access
  const allocationMap = useMemo(() => {
    const map = new Map();
    
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      map.set(key, allocation.hours);
    });
    
    return map;
  }, [allocations]);
  
  // Count projects per member for this week
  const projectCountByMember = useMemo(() => {
    const countMap = new Map();
    
    members.forEach(member => {
      // Initialize count to 0
      countMap.set(member.id, 0);
    });
    
    allocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      // Only count if hours > 0
      if (allocation.hours > 0) {
        // Get current count or 0 if not set
        const currentProjects = new Set(countMap.get(memberId + '_projects') || []);
        currentProjects.add(allocation.project_id);
        countMap.set(memberId + '_projects', currentProjects);
        countMap.set(memberId, currentProjects.size);
      }
    });
    
    return countMap;
  }, [members, allocations]);
  
  // Calculate total project hours
  const projectTotals = useMemo(() => {
    const totals = new Map();
    
    allocations.forEach(allocation => {
      const projectId = allocation.project_id;
      const currentTotal = totals.get(projectId) || 0;
      totals.set(projectId, currentTotal + allocation.hours);
    });
    
    return totals;
  }, [allocations]);
  
  // Calculate total member hours
  const memberTotals = useMemo(() => {
    const totals = new Map();
    
    allocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const currentTotal = totals.get(memberId) || 0;
      totals.set(memberId, currentTotal + allocation.hours);
    });
    
    return totals;
  }, [allocations]);
  
  // Filter leave data for the selected week
  const getWeeklyLeave = (memberId: string) => {
    if (!leaveData[memberId]) return [];
    
    const memberLeaves = leaveData[memberId];
    const weekLeaveDays = Object.keys(memberLeaves)
      .filter(dateStr => {
        const date = new Date(dateStr);
        return isWithinInterval(date, { start: weekStart, end: weekEnd });
      })
      .map(dateStr => ({
        date: dateStr,
        hours: memberLeaves[dateStr]
      }));
      
    return weekLeaveDays;
  };
  
  // Calculate total leave hours for the week
  const getTotalWeeklyLeaveHours = (memberId: string) => {
    const weekLeaveDays = getWeeklyLeave(memberId);
    return weekLeaveDays.reduce((total, day) => total + day.hours, 0);
  };
  
  // Handler for leave input changes, now supporting notes
  const handleLeaveInputChange = (memberId: string, leaveType: string, value: string) => {
    setManualLeaveData(prev => {
      const newLeaveData = {...prev};
      if (!newLeaveData[memberId]) {
        newLeaveData[memberId] = {};
      }
      
      // If it's notes, we store it as a string, otherwise convert to number
      if (leaveType === 'notes') {
        newLeaveData[memberId][leaveType] = value;
      } else {
        const hours = value === '' ? 0 : Math.min(parseFloat(value), 40);
        
        if (isNaN(hours)) return prev;
        newLeaveData[memberId][leaveType] = hours;
      }
      
      return newLeaveData;
    });
  };
  
  // Handler for remarks updates
  const handleRemarksUpdate = (memberId: string, remarks: string) => {
    setRemarksData(prev => ({
      ...prev,
      [memberId]: remarks
    }));
  };
  
  return {
    membersMap,
    allocationMap,
    projectCountByMember,
    projectTotals,
    memberTotals,
    manualLeaveData,
    remarksData,
    getWeeklyLeave,
    getTotalWeeklyLeaveHours,
    handleLeaveInputChange,
    handleRemarksUpdate,
    isLoadingLeave
  };
};
