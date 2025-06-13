
export const createAllocationMap = (weekAllocations: any[]) => {
  const allocationMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      allocationMap.set(key, allocation.hours);
    });
  }
  return allocationMap;
};

export const calculateMemberWeeklyTotals = (
  comprehensiveWeeklyAllocations: any[],
  weekStartDate: string,
  members: any[]
) => {
  const memberWeeklyTotals = new Map<string, number>();
  
  if (comprehensiveWeeklyAllocations) {
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const hours = Number(allocation.hours) || 0;
      const currentTotal = memberWeeklyTotals.get(memberId) || 0;
      memberWeeklyTotals.set(memberId, currentTotal + hours);
    });
  }

  console.log('=== UPDATED WEEKLY TOTALS CALCULATION ===');
  console.log('Week start date:', weekStartDate);
  console.log('Member weekly totals (active + pre-registered):', Object.fromEntries(memberWeeklyTotals));
  console.log('Total members with allocations:', memberWeeklyTotals.size);
  console.log('All members in system:', members.map(m => ({ 
    id: m.id, 
    name: `${m.first_name} ${m.last_name}`,
    total: memberWeeklyTotals.get(m.id) || 0
  })));

  return memberWeeklyTotals;
};

export const createMemberTotalFunction = (
  memberWeeklyTotals: Map<string, number>,
  comprehensiveWeeklyAllocations: any[]
) => {
  return (memberId: string): number => {
    const total = memberWeeklyTotals.get(memberId) || 0;
    console.log(`=== MEMBER TOTAL LOOKUP (UPDATED) ===`);
    console.log(`Member ${memberId} weekly total hours:`, total);
    
    // Also log the individual allocations for this member for debugging
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(a => a.resource_id === memberId) || [];
    console.log(`Member ${memberId} individual allocations:`, memberAllocations.map(a => ({
      project_id: a.project_id,
      hours: a.hours,
      resource_type: a.resource_type,
      week_start_date: a.week_start_date
    })));
    
    return total;
  };
};

export const createProjectCountFunction = (comprehensiveWeeklyAllocations: any[]) => {
  return (memberId: string): number => {
    let count = 0;
    if (comprehensiveWeeklyAllocations) {
      // Count unique projects this member is allocated to during the week
      const memberProjects = new Set();
      comprehensiveWeeklyAllocations
        .filter(allocation => allocation.resource_id === memberId && (Number(allocation.hours) || 0) > 0)
        .forEach(allocation => memberProjects.add(allocation.project_id));
      count = memberProjects.size;
    }
    console.log(`Member ${memberId} project count (active + pre-registered):`, count);
    return count;
  };
};

export const createWeeklyLeaveFunction = (weeklyLeaveDetails: Record<string, Array<{ date: string; hours: number }>> | undefined) => {
  return (memberId: string): Array<{ date: string; hours: number }> => {
    if (!weeklyLeaveDetails || !weeklyLeaveDetails[memberId]) {
      return [];
    }
    
    // Sort by date and return
    return weeklyLeaveDetails[memberId].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
};
