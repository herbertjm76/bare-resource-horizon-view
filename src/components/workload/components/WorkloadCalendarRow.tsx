
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';
import { WeeklyWorkloadBreakdown } from '../hooks/types';
import { WorkloadCalendarCell } from './WorkloadCalendarCell';

interface WorkloadCalendarRowProps {
  member: TeamMember;
  memberIndex: number;
  weekStartDates: Array<{ date: Date; key: string }>;
  memberWeeklyData: Record<string, WeeklyWorkloadBreakdown>;
}

export const WorkloadCalendarRow: React.FC<WorkloadCalendarRowProps> = ({
  member,
  memberIndex,
  weekStartDates,
  memberWeeklyData
}) => {
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Helper functions
  const getUserInitials = (member: TeamMember): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  const getMemberDisplayName = (member: TeamMember): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  const memberDisplayName = getMemberDisplayName(member);
  
  // Calculate total hours across all weeks
  const totalHours = weekStartDates.reduce((sum, week) => {
    const weekData = memberWeeklyData[week.key];
    return sum + (weekData?.total || 0);
  }, 0);
  
  const totalCapacity = weeklyCapacity * weekStartDates.length;
  const utilizationPercent = totalCapacity > 0 ? Math.round((totalHours / totalCapacity) * 100) : 0;

  // Debug logging for specific member
  if (memberDisplayName.toLowerCase().includes('paul')) {
    console.log(`Workload data for ${memberDisplayName}:`, {
      memberWeeklyData,
      totalHours,
      weeklyCapacity,
      sampleWeekData: weekStartDates.slice(0, 3).map(week => ({
        week: week.key,
        date: format(week.date, 'MMM d'),
        data: memberWeeklyData[week.key]
      }))
    });
  }
  
  return (
    <tr 
      key={member.id} 
      className={`workload-grid-row ${memberIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200`}
    >
      <td className="workload-grid-cell member-cell sticky-left-0 bg-inherit z-5 border-r-2 border-gray-300">
        <div className="member-info">
          <Avatar className="member-avatar">
            <AvatarImage src={getAvatarUrl(member)} alt={memberDisplayName} />
            <AvatarFallback style={{ backgroundColor: '#6366f1', color: 'white' }}>
              {getUserInitials(member)}
            </AvatarFallback>
          </Avatar>
          <span className="member-name">
            {member.first_name} {member.last_name}
          </span>
        </div>
      </td>
      
      {weekStartDates.map((week) => (
        <WorkloadCalendarCell
          key={week.key}
          week={week}
          weekData={memberWeeklyData[week.key]}
          memberName={memberDisplayName}
          weeklyCapacity={weeklyCapacity}
        />
      ))}
      
      <td className="workload-grid-cell total-cell bg-gray-50 font-semibold">
        <div className={`utilization-badge ${utilizationPercent > 100 ? 'high' : utilizationPercent >= 80 ? 'medium' : 'low'}`}>
          {utilizationPercent}%
        </div>
      </td>
    </tr>
  );
};
