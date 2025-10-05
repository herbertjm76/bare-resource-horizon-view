
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TeamMember } from '@/components/dashboard/types';
import { format, getDaysInMonth, startOfMonth, getDay } from 'date-fns';
import { Input } from '@/components/ui/input';

interface LeaveCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  leaveData: Record<string, Record<string, number>>;
  onLeaveChange: (memberId: string, date: string, hours: number) => void;
}

export const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  members,
  selectedMonth,
  leaveData,
  onLeaveChange
}) => {
  // Generate days for the selected month
  const daysInMonth = getDaysInMonth(selectedMonth);
  const firstDayOfMonth = startOfMonth(selectedMonth);
  const firstDayWeekday = getDay(firstDayOfMonth);
  
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const date = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day);
    const dayOfWeek = getDay(date);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
    return {
      day,
      date: format(date, 'yyyy-MM-dd'),
      dayOfWeek,
      isWeekend,
      isSunday: dayOfWeek === 0
    };
  });

  const handleLeaveChange = (memberId: string, date: string, value: string) => {
    const hours = parseFloat(value) || 0;
    onLeaveChange(memberId, date, hours);
  };

  // Helper to get user initials
  const getUserInitials = (member: TeamMember): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: TeamMember): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: TeamMember): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  return (
    <div className="annual-leave-grid-container">
      <div className="enhanced-table-container">
        <table className="enhanced-table">
          <thead>
            <tr>
              <th className="sticky-left-0 min-w-48 bg-white text-left px-4 py-3">Team Member</th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    min-w-12 text-center text-xs font-semibold px-2 py-3
                    ${day.isWeekend ? 'weekend' : ''}
                    ${day.isSunday ? 'sunday-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs opacity-80">
                      {format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day.day), 'EEE')}
                    </span>
                    <span className="text-sm font-bold">{day.day}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {members.map((member, memberIndex) => {
              const memberLeaveData = leaveData[member.id] || {};
              
              return (
                <tr 
                  key={member.id} 
                  className={`
                    member-row
                    ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                  `}
                >
                  <td className="sticky-left-0 bg-inherit border-r px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-gradient-modern text-white text-sm">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {member.first_name} {member.last_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  {days.map((day) => {
                    const currentValue = memberLeaveData[day.date] || 0;
                    const hasValue = currentValue > 0;
                    
                    return (
                      <td 
                        key={day.date} 
                        className={`
                          text-center p-2
                          ${day.isWeekend ? 'weekend' : ''}
                          ${day.isSunday ? 'sunday-border' : ''}
                          ${hasValue ? 'leave-cell-filled' : ''}
                        `}
                      >
                        <input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          value={currentValue || ''}
                          onChange={(e) => handleLeaveChange(member.id, day.date, e.target.value)}
                          className="enhanced-input"
                          placeholder="0"
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
