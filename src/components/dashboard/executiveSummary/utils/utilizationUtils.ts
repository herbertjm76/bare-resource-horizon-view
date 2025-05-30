
export const getUtilizationStatus = (rate: number) => {
  if (rate > 90) return { color: 'destructive', label: 'Over Capacity' };
  if (rate > 65) return { color: 'default', label: 'Optimally Allocated' };
  return { color: 'outline', label: 'Ready for Projects' };
};

export const getTimeRangeText = (selectedTimeRange: string) => {
  switch (selectedTimeRange) {
    case 'week': return 'This Week';
    case 'month': return 'This Month';
    case '3months': return 'This Quarter';
    case '4months': return '4 Months';
    case '6months': return '6 Months';
    case 'year': return 'This Year';
    default: return 'Selected Period';
  }
};
