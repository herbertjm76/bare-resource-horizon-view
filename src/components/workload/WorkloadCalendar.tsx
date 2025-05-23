
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

interface WorkloadCalendarProps {
  members: TeamMember[];
  selectedMonth: Date;
  workloadData: Record<string, Record<string, number>>;
}

export const WorkloadCalendar: React.FC<WorkloadCalendarProps> = ({
  members,
  selectedMonth,
  workloadData
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
  
  // Helper to get the name for a member
  const getMemberName = (member: TeamMember) => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };
  
  // Custom day formatter for minimal day representation with unique identifiers
  const getMinimalDayLabel = (day: Date): string => {
    const dayOfWeek = day.getDay();
    switch(dayOfWeek) {
      case 0: return 'Su'; // Sunday
      case 1: return 'M';  // Monday
      case 2: return 'Tu'; // Tuesday
      case 3: return 'W';  // Wednesday
      case 4: return 'Th'; // Thursday
      case 5: return 'F';  // Friday
      case 6: return 'Sa'; // Saturday
      default: return '';
    }
  };

  // Helper to determine cell styling based on hours value
  const getCellStyle = (hours: number | undefined) => {
    if (!hours) return '';
    
    // Different intensity classes based on hours
    if (hours >= 8) return 'bg-brand-violet font-medium text-white';
    if (hours >= 6) return 'bg-brand-violet-light font-medium';
    if (hours >= 4) return 'bg-brand-violet-light/70 font-medium';
    if (hours >= 2) return 'bg-brand-violet-light/50';
    if (hours > 0) return 'bg-brand-violet-light/30';
    
    return '';
  };
  
  // Helper to check if the cell should have a thick border (Sunday-Monday separator)
  const isSundayBorder = (day: Date): boolean => {
    return day.getDay() === 0; // Sunday
  };
  
  // Calculate monthly total for each member
  const getMonthlyTotal = (memberId: string): number => {
    if (!workloadData[memberId]) return 0;
    
    return Object.values(workloadData[memberId]).reduce((total, hours) => total + hours, 0);
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
            <TableHead className="p-0 text-center w-16 border-l">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMembers.map((member, rowIndex) => {
            const monthlyTotal = getMonthlyTotal(member.id);
            
            return (
              <TableRow key={member.id}>
                <TableCell 
                  className="whitespace-nowrap font-medium sticky left-0 z-10 p-1.5 border-r" 
                  style={{ backgroundColor: rowIndex % 2 === 0 ? 'white' : 'rgba(0,0,0,0.07)' }}
                >
                  {getMemberName(member)}
                </TableCell>
                {daysInMonth.map(day => {
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const hours = workloadData[member.id]?.[dateKey] || 0;
                  const isSundayCol = isSundayBorder(day);
                  
                  // Round hours to 1 decimal place for display
                  const displayHours = Math.round(hours * 10) / 10;
                  
                  return (
                    <TableCell 
                      key={`${member.id}-${dateKey}`} 
                      className={`p-0 text-center ${isWeekend ? 'bg-muted/60' : ''} 
                        ${day.getDate() === 1 || day.getDay() === 0 ? 'border-l' : ''} 
                        ${isSundayCol ? 'sunday-border' : ''}
                        ${getCellStyle(hours)}`}
                    >
                      {displayHours > 0 ? displayHours : ''}
                    </TableCell>
                  );
                })}
                <TableCell className="p-1 text-center border-l font-medium">
                  {Math.round(monthlyTotal * 10) / 10}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
