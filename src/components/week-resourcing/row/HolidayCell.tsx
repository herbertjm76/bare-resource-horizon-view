
import React, { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { format, isWithinInterval, parseISO, addDays } from 'date-fns';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';

interface HolidayCellProps {
  holidayHours: number;
  memberId: string;
  memberOffice?: string;
  weekStartDate: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const HolidayCell: React.FC<HolidayCellProps> = ({
  memberId,
  memberOffice,
  weekStartDate,
  onLeaveInputChange
}) => {
  const [holidayHours, setHolidayHours] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { locations } = useOfficeSettings();
  const [holidayNames, setHolidayNames] = useState<string[]>([]);
  const [autoDetected, setAutoDetected] = useState(false);
  
  // Function to get holidays from localStorage and calculate hours
  const calculateHolidayHours = () => {
    if (!memberOffice) return 0;
    
    try {
      const storedHolidays = localStorage.getItem("office_holidays");
      if (!storedHolidays) return 0;
      
      const holidays = JSON.parse(storedHolidays);
      if (!Array.isArray(holidays)) return 0;
      
      // Get the week range
      const weekStart = new Date(weekStartDate);
      const weekEnd = addDays(weekStart, 6);
      
      // Filter holidays that match the member's office and fall within the week
      const applicableHolidays = holidays.filter(holiday => {
        // Check if holiday applies to this member's office
        if (!holiday.offices || !holiday.offices.includes(memberOffice)) {
          return false;
        }
        
        // Parse dates properly - ensure we have Date objects
        const startDate = holiday.startDate instanceof Date 
          ? holiday.startDate 
          : new Date(holiday.startDate);
        
        const endDate = holiday.endDate instanceof Date 
          ? holiday.endDate 
          : new Date(holiday.endDate);
        
        // Check for any overlap between holiday period and week period
        return (
          (isWithinInterval(startDate, { start: weekStart, end: weekEnd }) ||
           isWithinInterval(endDate, { start: weekStart, end: weekEnd }) ||
           (startDate <= weekStart && endDate >= weekEnd))
        );
      });
      
      if (applicableHolidays.length > 0) {
        // Collect holiday names for tooltip
        setHolidayNames(applicableHolidays.map(h => h.description));
        
        // Calculate business days in the holiday period that fall within this week
        let holidayDays = 0;
        const currentDate = new Date(weekStart);
        
        while (currentDate <= weekEnd) {
          // Check if this day is a business day (not Sat/Sun)
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
            // Check if this day is in any of the applicable holidays
            const isHoliday = applicableHolidays.some(holiday => {
              const holidayStart = new Date(holiday.startDate);
              const holidayEnd = new Date(holiday.endDate);
              return currentDate >= holidayStart && currentDate <= holidayEnd;
            });
            
            if (isHoliday) {
              holidayDays++;
            }
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        // Assuming 8 hours per holiday day
        return holidayDays * 8;
      }
      
      return 0;
    } catch (err) {
      console.error("Error processing holidays:", err);
      return 0;
    }
  };
  
  // Auto-detect holidays when component mounts or when weekStartDate/memberOffice changes
  useEffect(() => {
    const calculatedHours = calculateHolidayHours();
    
    if (calculatedHours > 0) {
      setHolidayHours(calculatedHours);
      setAutoDetected(true);
      
      // Save the holiday hours automatically
      onLeaveInputChange(memberId, 'holiday', calculatedHours.toString());
      
      if (holidayNames.length > 0) {
        toast.info(`Office holiday detected: ${holidayNames.join(", ")}`, {
          description: `${calculatedHours} hours automatically applied for ${memberOffice} office`
        });
      }
    } else {
      setHolidayHours(0);
      setAutoDetected(false);
    }
  }, [weekStartDate, memberOffice, memberId]);
  
  return (
    <TableCell className="leave-cell text-center p-1 border-r">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              className={`w-full h-full flex justify-center items-center ${autoDetected ? 'bg-amber-50' : ''}`}
            >
              {holidayHours > 0 ? (
                <div className={`w-6 h-6 rounded-full ${autoDetected ? 'bg-amber-200' : 'bg-gray-250'} flex items-center justify-center`}>
                  <span className="text-xs font-medium text-gray-600">{holidayHours}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          </TooltipTrigger>
          {holidayNames.length > 0 && (
            <TooltipContent side="bottom">
              <div className="text-sm">
                <p className="font-medium">Office Holidays:</p>
                <ul className="list-disc pl-4 mt-1">
                  {holidayNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
