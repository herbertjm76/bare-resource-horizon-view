
export const createAllocationMap = (allocations: any[]) => {
  const allocationMap = new Map<string, number>();
  if (allocations) {
    allocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      const hours = Number(allocation.hours) || 0;
      
      // For comprehensive allocations, we sum up all hours for the same member-project combination
      // This handles cases where there might be multiple entries for the same member-project in a week
      const currentTotal = allocationMap.get(key) || 0;
      allocationMap.set(key, currentTotal + hours);
    });
  }
  
  console.log('=== ALLOCATION MAP CREATION ===');
  console.log('Input allocations:', allocations?.length || 0);
  console.log('Created allocation map with entries:', allocationMap.size);
  console.log('Sample entries:', Array.from(allocationMap.entries()).slice(0, 3));
  
  return allocationMap;
};

export const calculateMemberWeeklyTotals = (
  comprehensiveWeeklyAllocations: any[],
  weekStartDate: string,
  members: any[]
) => {
  const memberWeeklyTotals = new Map<string, number>();
  
  if (comprehensiveWeeklyAllocations) {
    // Group allocations by member and sum ALL their project hours for the week
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const hours = Number(allocation.hours) || 0;
      const currentTotal = memberWeeklyTotals.get(memberId) || 0;
      memberWeeklyTotals.set(memberId, currentTotal + hours);
    });
  }

  console.log('=== UPDATED WEEKLY TOTALS CALCULATION ===');
  console.log('Week start date:', weekStartDate);
  console.log('Total comprehensive allocations processed:', comprehensiveWeeklyAllocations?.length || 0);
  console.log('Member weekly totals (ALL projects combined):', Object.fromEntries(memberWeeklyTotals));
  console.log('Total members with allocations:', memberWeeklyTotals.size);
  
  // Log detailed breakdown for each member
  memberWeeklyTotals.forEach((totalHours, memberId) => {
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(a => a.resource_id === memberId) || [];
    const memberName = members.find(m => m.id === memberId);
    console.log(`Member ${memberName?.first_name} ${memberName?.last_name} (${memberId}):`, {
      totalWeeklyHours: totalHours,
      projectBreakdown: memberAllocations.map(a => ({
        project_id: a.project_id,
        hours: a.hours,
        resource_type: a.resource_type
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
    console.log(`=== MEMBER TOTAL LOOKUP (COMPREHENSIVE) ===`);
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
    console.log(`Member ${memberId} project count (comprehensive):`, count);
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
