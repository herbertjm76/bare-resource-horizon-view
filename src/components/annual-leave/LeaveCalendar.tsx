
import React from 'react';
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
  
  // Modified input change handler to restrict input to a single digit (0-9)
  const handleInputChange = (memberId: string, date: string, value: string) => {
    // If the value is empty, treat it as 0
    if (value === '') {
      onLeaveChange(memberId, date, 0);
      return;
    }
    
    // Only allow digits 0-9
    const digit = parseInt(value.slice(-1), 10);
    
    // Check if it's a valid number
    if (!isNaN(digit) && digit >= 0 && digit <= 9) {
      onLeaveChange(memberId, date, digit);
    }
  };

  // Helper to get the name for a member
  const getMemberName = (member: TeamMember) => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };
  
  // Custom day formatter for minimal day representation with unique identifiers
  const getMinimalDayLabel = (day: Date): string => {
    const dayOfWeek = day.getDay();
    switch(dayOfWeek) {
      case 0: return 'Su'; // Changed from 'S' to 'Su' for Sunday
      case 1: return 'M';
      case 2: return 'Tu'; // Changed from 'T' to 'Tu' for Tuesday
      case 3: return 'W';
      case 4: return 'Th';
      case 5: return 'F';
      case 6: return 'Sa'; // Changed from 'S' to 'Sa' for Saturday
      default: return '';
    }
  };

  // Helper to determine cell styling based on hours value
  const getCellStyle = (hours: number | undefined) => {
    if (!hours) return '';
    if (hours > 0) return 'bg-brand-violet-light font-medium';
    return '';
  };
  
  // Helper to check if the cell should have a thick border (Sunday-Monday separator)
  const isSundayBorder = (day: Date): boolean => {
    return day.getDay() === 0; // Sunday
  };
  
  return (
    <div className="overflow-x-auto annual-leave-calendar">
      <Table>
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow>
            <TableHead className="sticky left-0 bg-background z-10 min-w-[180px] border-r">Member</TableHead>
            {daysInMonth.map(day => {
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;
              const dayNumber = format(day, 'd');
              const dayLabel = getMinimalDayLabel(day);
              const isSundayCol = isSundayBorder(day);
              
              return (
                <TableHead 
                  key={day.toString()} 
                  className={`p-0 text-center w-8 ${isWeekend ? 'bg-muted/60' : ''} ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} ${isSundayCol ? 'sunday-border' : ''}`}
                  aria-label={format(day, 'EEEE')}
                >
                  <div className="flex flex-col items-center text-xs py-1 px-2">
                    <span className={`text-muted-foreground ${isWeekend ? 'font-medium' : ''}`}>{dayLabel}</span>
                    <span className={`${isWeekend ? 'font-bold' : 'font-medium'}`}>{dayNumber}</span>
                  </div>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.map((member, rowIndex) => (
            <TableRow 
              key={member.id}
            >
              <TableCell className="whitespace-nowrap font-medium sticky left-0 z-10 p-1.5 border-r" 
                style={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : 'rgba(0,0,0,0.07)' }}>
                {getMemberName(member)}
              </TableCell>
              {daysInMonth.map(day => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                const hours = leaveData[member.id]?.[dateKey];
                const isSundayCol = isSundayBorder(day);
                
                // Updated style logic: Always make font bold (medium), but color differently based on value
                const inputValueStyle = hours === 0 
                  ? 'font-medium text-gray-250' // Light grey for zero
                  : hours > 0 
                    ? 'font-medium text-brand-primary' // Bold purple for other digits
                    : 'font-medium text-gray-250'; // Light grey for empty/null
                
                return (
                  <TableCell 
                    key={`${member.id}-${dateKey}`} 
                    className={`p-0 text-center leave-cell ${isWeekend ? 'bg-muted/60' : ''} 
                      ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} 
                      ${isSundayCol ? 'sunday-border' : ''}
                      ${getCellStyle(hours)}`}
                  >
                    <Input 
                      type="text" 
                      maxLength={1}
                      value={hours !== undefined ? hours : ''} 
                      onChange={e => handleInputChange(member.id, dateKey, e.target.value)} 
                      placeholder="0" 
                      className={`h-7 w-7 p-0 text-center border-0 hover:border hover:border-input 
                        focus:border focus:border-input rounded-sm ${inputValueStyle}`}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
