
export const calculateCapacityHours = (
  selectedTimeRange: string,
  activeResources: number,
  utilizationRate: number,
  staffData: Array<{ weekly_capacity?: number }>,
  workWeekHours: number = 40
) => {
  const multiplier = (() => {
    switch (selectedTimeRange) {
      case 'week': return 1;
      case 'month': return 4;
      case '3months': return 12;
      case '4months': return 16;
      case '6months': return 24;
      case 'year': return 48;
      default: return 4;
    }
  })();

  let totalCapacity: number;
  
  if (staffData.length > 0) {
    // Calculate based on actual staff data
    totalCapacity = staffData.reduce((sum, member) => {
      return sum + (member.weekly_capacity || workWeekHours) * multiplier;
    }, 0);
  } else {
    // Fallback to basic calculation
    totalCapacity = activeResources * workWeekHours * multiplier;
  }

  const totalAllocated = totalCapacity * (utilizationRate / 100);
  const availableCapacity = totalCapacity - totalAllocated;
  
  return Math.round(availableCapacity);
};
