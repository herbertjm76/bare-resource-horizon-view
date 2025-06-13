
export const createAllocationMap = (allocations: any[]) => {
  const allocationMap = new Map<string, number>();
  if (allocations) {
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      const hours = Number(allocation.hours) || 0;
      
      // Set the weekly total directly (allocations are already aggregated by week)
      allocationMap.set(key, hours);
    });
  }
  
  console.log('=== ALLOCATION MAP CREATION (FIXED V2) ===');
  console.log('Input weekly allocations:', allocations?.length || 0);
  console.log('Created allocation map with entries:', allocationMap.size);
  console.log('All allocation map entries (key: member:project, value: weekly hours):', 
    Array.from(allocationMap.entries()).map(([key, hours]) => `${key} = ${hours}h`));
  
  return allocationMap;
};

export const calculateMemberWeeklyTotals = (
  comprehensiveWeeklyAllocations: any[],
  weekStartDate: string,
  members: any[]
) => {
  const memberWeeklyTotals = new Map<string, number>();
  
  if (comprehensiveWeeklyAllocations) {
    // Sum all project hours for each member (allocations are already weekly totals)
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const hours = Number(allocation.hours) || 0;
      const currentTotal = memberWeeklyTotals.get(memberId) || 0;
      memberWeeklyTotals.set(memberId, currentTotal + hours);
    });
  }

  console.log('=== WEEKLY TOTALS CALCULATION (FIXED V2) ===');
  console.log('Week start date:', weekStartDate);
  console.log('Total weekly allocations processed:', comprehensiveWeeklyAllocations?.length || 0);
  console.log('Member weekly totals (ALL projects combined for ENTIRE week):', Object.fromEntries(memberWeeklyTotals));
  console.log('Total members with allocations:', memberWeeklyTotals.size);
  
  // Log detailed breakdown for each member to verify weekly totals
  memberWeeklyTotals.forEach((totalHours, memberId) => {
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(a => a.resource_id === memberId) || [];
    const memberName = members.find(m => m.id === memberId);
    console.log(`Member ${memberName?.first_name} ${memberName?.last_name} (${memberId}):`, {
      totalWeeklyHours: totalHours,
      expectedWeeklyTotal: memberAllocations.reduce((sum, a) => sum + Number(a.hours), 0),
      projectBreakdown: memberAllocations.map(a => ({
        project_id: a.project_id,
        hours: a.hours
      }))
    });
  });

  return memberWeeklyTotals;
};

export const createMemberTotalFunction = (
  memberWeeklyTotals: Map<string, number>,
  comprehensiveWeeklyAllocations: any[]
) => {
  return (memberId: string): number => {
    const total = memberWeeklyTotals.get(memberId) || 0;
    console.log(`=== MEMBER TOTAL LOOKUP (FIXED V2) ===`);
    console.log(`Member ${memberId} weekly total hours:`, total);
    
    // Also log the individual allocations for this member for debugging
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(a => a.resource_id === memberId) || [];
    console.log(`Member ${memberId} weekly project allocations:`, memberAllocations.map(a => ({
      project_id: a.project_id,
      hours: a.hours
    })));
    console.log(`Verification: Sum of individual allocations = ${memberAllocations.reduce((sum, a) => sum + Number(a.hours), 0)}h`);
    
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
    console.log(`Member ${memberId} project count (fixed v2):`, count);
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
