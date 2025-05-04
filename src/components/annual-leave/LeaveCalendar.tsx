import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { Input } from "@/components/ui/input";
import { TeamMember } from '@/components/dashboard/types';
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
  // Get all days in the selected month
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(selectedMonth),
    end: endOfMonth(selectedMonth)
  });

  // Sort members by name
  const sortedMembers = [...members].sort((a, b) => {
    const nameA = `${a.first_name || ''} ${a.last_name || ''}`.trim();
    const nameB = `${b.first_name || ''} ${b.last_name || ''}`.trim();
    return nameA.localeCompare(nameB);
  });
  const handleInputChange = (memberId: string, date: string, value: string) => {
    const hours = parseFloat(value) || 0;
    onLeaveChange(memberId, date, hours);
  };

  // Helper to get the name for a member
  const getMemberName = (member: TeamMember) => {
    const isPending = 'isPending' in member && member.isPending;
    return `${member.first_name || ''} ${member.last_name || ''}${isPending ? ' (pending)' : ''}`.trim();
  };
  return <div className="overflow-x-auto">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 min-w-[200px]">Member</TableHead>
            {daysInMonth.map(day => <TableHead key={day.toString()} className={`px-2 py-2 text-center w-16 ${day.getDay() === 0 || day.getDay() === 6 ? 'bg-muted/30' : ''}`}>
                <div className="flex flex-col items-center">
                  <span className="text-xs">{format(day, 'EEE')}</span>
                  <span className="font-medium">{format(day, 'd')}</span>
                </div>
              </TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.map(member => <TableRow key={member.id}>
              <TableCell className="whitespace-nowrap font-medium sticky left-0 bg-background z-10">
                {getMemberName(member)}
              </TableCell>
              {daysInMonth.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;
            return <TableCell key={`${member.id}-${dateKey}`} className={`p-0 text-center ${isWeekend ? 'bg-muted/30' : ''}`}>
                    <Input type="number" min="0" max="24" value={leaveData[member.id]?.[dateKey] || ''} onChange={e => handleInputChange(member.id, dateKey, e.target.value)} placeholder="0" className="h-8 w-8 p-1 text-center border-0 hover:border hover:border-input focus:border focus:border-input px-0 py-0" />
                  </TableCell>;
          })}
            </TableRow>)}
        </TableBody>
      </Table>
    </div>;
};