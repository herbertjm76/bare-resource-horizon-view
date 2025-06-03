
import React from 'react';
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

  return (
    <div className="annual-leave-grid-container">
      <div className="enhanced-table-container">
        <table className="enhanced-table">
          <thead>
            <tr>
              <th className="sticky-left-0 min-w-48 bg-white">Team Member</th>
              {days.map((day) => (
                <th 
                  key={day.day} 
                  className={`
                    min-w-16 text-center text-xs font-semibold
                    ${day.isWeekend ? 'weekend' : ''}
                    ${day.isSunday ? 'sunday-border' : ''}
                  `}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] opacity-75">
                      {format(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), day.day), 'EEE')}
                    </span>
                    <span className="text-sm font-bold">{day.day}</span>
                  </div>
                </th>
              ))}
              <th className="min-w-20 text-center total-hours-column">
                <div className="enhanced-hours-pill">
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
                    member-row
                    ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}
                  `}
                >
                  <td className="sticky-left-0 bg-inherit border-r-2 border-gray-200">
                    <div className="flex items-center gap-3 p-2">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 text-gray-700 text-xs font-semibold">
                        {member.first_name?.charAt(0) || '?'}{member.last_name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {member.location || 'No location'}
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
                          text-center p-1
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
                          className="enhanced-input h-8 text-xs"
                          placeholder="0"
                        />
                      </td>
                    );
                  })}
                  <td className="text-center total-hours-column">
                    <div className="enhanced-hours-pill">
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
