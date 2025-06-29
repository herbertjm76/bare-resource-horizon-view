
import { format, startOfWeek, addWeeks } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown, WeekStartDate } from '../types';

export const initializeWorkloadData = (
  members: TeamMember[],
  startDate: Date,
  numberOfWeeks: number
): Record<string, Record<string, WeeklyWorkloadBreakdown>> => {
  const result: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};

  // Initialize all members and weeks with empty data
  for (const member of members) {
    result[member.id] = {};
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
      const weekKey = format(weekStart, 'yyyy-MM-dd');
      result[member.id][weekKey] = {
        projectHours: 0,
        annualLeave: 0,
        officeHolidays: 0,
        otherLeave: 0,
        total: 0,
        projects: []
      };
    }
  }

  return result;
};

export const generateWeekStartDates = (
  startDate: Date,
  numberOfWeeks: number
): WeekStartDate[] => {
  const weekStartDates = [];
  for (let i = 0; i < numberOfWeeks; i++) {
    const weekStart = startOfWeek(addWeeks(startDate, i), { weekStartsOn: 1 });
    weekStartDates.push({
      date: weekStart,
      key: format(weekStart, 'yyyy-MM-dd')
    });
  }
  return weekStartDates;
};

export const debugWorkloadData = (
  members: TeamMember[],
  result: Record<string, Record<string, WeeklyWorkloadBreakdown>>,
  allocations: any[]
) => {
  // Debug logging for specific member (Paul Julius)
  const paulMember = members.find(m => 
    m.first_name?.toLowerCase().includes('paul') || 
    m.last_name?.toLowerCase().includes('julius')
  );
  
  if (paulMember && result[paulMember.id]) {
    console.log(`Workload calculation for ${paulMember.first_name} ${paulMember.last_name}:`, {
      memberId: paulMember.id,
      weeklyData: Object.entries(result[paulMember.id]).slice(0, 5),
      june9Week: result[paulMember.id]['2024-06-03'] || result[paulMember.id]['2024-06-10'],
      allocationsSample: allocations?.filter(a => a.resource_id === paulMember.id).slice(0, 5)
    });
  }

  console.log('Completed workload data processing. Sample result:', {
    totalMembers: Object.keys(result).length,
    totalWeeks: Object.keys(result[Object.keys(result)[0]] || {}).length,
    sampleMemberWeeks: Object.entries(result)[0]?.[1] ? Object.keys(Object.entries(result)[0][1]).length : 0,
    allocationsProcessed: allocations?.length || 0
  });
};
