
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
              <th className="sticky-left-0 min-w-32 bg-white text-left px-2 py-1">Team Member</th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    min-w-12 text-center text-xs font-semibold px-1 py-1
                    ${day.isWeekend ? 'weekend' : ''}
                    ${day.isSunday ? 'sunday-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-[9px] opacity-75">
                      {format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day.day), 'EEE')}
                    </span>
                    <span className="text-xs font-bold">{day.day}</span>
                  </div>
                </th>
              ))}
              <th className="min-w-16 text-center total-hours-column px-1 py-1">
                <div className="enhanced-hours-pill text-xs">
                  Total
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, memberIndex) => {
              const memberLeaveData = leaveData[member.id] || {};
              const totalHours = Object.values(memberLeaveData).reduce((sum, hours) => sum + hours, 0);
              
              return (
                <tr 
                  key={member.id} 
                  className={`
                    member-row h-10
                    ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                  `}
                >
                  <td className="sticky-left-0 bg-inherit border-r-2 border-gray-200 px-2 py-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-brand-violet text-white text-xs">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-gray-900 truncate">
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
                          text-center p-0.5
                          ${day.isWeekend ? 'weekend' : ''}
                          ${day.isSunday ? 'sunday-border' : ''}
                          ${hasValue ? 'leave-cell-filled' : ''}
                        `}
                      >
                        <Input
                          type="number"
                          min="0"
                          max="8"
                          step="0.5"
                          value={currentValue || ''}
                          onChange={(e) => handleLeaveChange(member.id, day.date, e.target.value)}
                          className="enhanced-input h-6 text-xs w-10"
                          placeholder="0"
                        />
                      </td>
                    );
                  })}
                  <td className="text-center total-hours-column px-1 py-1">
                    <div className="enhanced-hours-pill text-xs">
                      {totalHours || 0}h
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
