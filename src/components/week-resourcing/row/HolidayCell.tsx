
import React, { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { format, isWithinInterval, parseISO, addDays } from 'date-fns';
import { toast } from 'sonner';

interface HolidayCellProps {
  holidayHours: number;
  memberId: string;
  memberOffice?: string;
  weekStartDate: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

export const HolidayCell: React.FC<HolidayCellProps> = ({
  holidayHours,
  memberId,
  memberOffice,
  weekStartDate,
  onLeaveInputChange
}) => {
  const [inputValue, setInputValue] = useState<string>(holidayHours.toString());
  const [isOpen, setIsOpen] = useState(false);
  const [calculatedHolidayHours, setCalculatedHolidayHours] = useState(0);
  const { locations } = useOfficeSettings();
  const [holidayNames, setHolidayNames] = useState<string[]>([]);
  const [autoDetected, setAutoDetected] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);
  
  // Function to get holidays from localStorage and calculate hours
  const calculateHolidayHours = () => {
    if (!memberOffice) return 0;
    
    try {
      const storedHolidays = localStorage.getItem("office_holidays");
      if (!storedHolidays) return 0;
      
      const holidays = JSON.parse(storedHolidays);
      if (!Array.isArray(holidays)) return 0;
      
      console.log("Found holidays in localStorage:", holidays);
      console.log("Member office:", memberOffice);
      
      // Get the week range
      const weekStart = new Date(weekStartDate);
      const weekEnd = addDays(weekStart, 6);
      
      console.log("Week range:", format(weekStart, 'yyyy-MM-dd'), "to", format(weekEnd, 'yyyy-MM-dd'));
      
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
        
        console.log(`Checking holiday: ${holiday.description}`, 
          format(startDate, 'yyyy-MM-dd'), "to", format(endDate, 'yyyy-MM-dd'),
          "applies to offices:", holiday.offices);
        
        // Check for any overlap between holiday period and week period
        return (
          (isWithinInterval(startDate, { start: weekStart, end: weekEnd }) ||
           isWithinInterval(endDate, { start: weekStart, end: weekEnd }) ||
           (startDate <= weekStart && endDate >= weekEnd))
        );
      });
      
      console.log("Applicable holidays:", applicableHolidays);
      
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
        
        console.log(`Found ${holidayDays} business days that are holidays this week`);
        
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
    setCalculatedHolidayHours(calculatedHours);
    
    // Auto-apply holiday hours if there are any and we haven't manually set a different value
    if (calculatedHours > 0 && !autoApplied) {
      setInputValue(calculatedHours.toString());
      onLeaveInputChange(memberId, 'holiday', calculatedHours.toString());
      setAutoDetected(true);
      setAutoApplied(true);
      
      if (holidayNames.length > 0) {
        toast.info(`Office holiday detected: ${holidayNames.join(", ")}`, {
          description: `${calculatedHours} hours automatically applied for ${memberOffice} office`
        });
      }
    }
  }, [weekStartDate, memberOffice, memberId]);
  
  // Update input value when external holidayHours changes (e.g. from parent component)
  useEffect(() => {
    // Only update if the value is different and it's not due to our auto-detection
    if (holidayHours.toString() !== inputValue && !autoDetected) {
      setInputValue(holidayHours.toString());
    }
  }, [holidayHours]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    // User is making manual changes
    setAutoDetected(false);
  };
  
  const handleSave = () => {
    onLeaveInputChange(memberId, 'holiday', inputValue);
    setIsOpen(false);
  };
  
  // Determine if this value was auto-generated
  const isAutoGenerated = autoDetected && calculatedHolidayHours > 0;
  
  return (
    <TableCell className="leave-cell text-center p-1 border-r">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div 
            className={`w-full h-full flex justify-center items-center cursor-pointer ${isAutoGenerated ? 'bg-amber-50' : ''}`}
            title={holidayNames.length > 0 ? `Holidays: ${holidayNames.join(", ")}` : undefined}
          >
            {parseInt(inputValue) > 0 ? (
              <div className={`w-6 h-6 rounded-full ${isAutoGenerated ? 'bg-amber-200' : 'bg-gray-250'} flex items-center justify-center`}>
                <span className="text-xs font-medium text-gray-600">{inputValue}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Holiday Hours</h4>
            {holidayNames.length > 0 && (
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Auto-detected Office Holidays:</p>
                <ul className="list-disc pl-4 mt-1">
                  {holidayNames.map((name, i) => (
                    <li key={i}>{name}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium">Hours {isAutoGenerated && "(Auto-detected)"}</label>
              <Input
                type="number"
                min="0"
                max="40"
                value={inputValue}
                onChange={handleInputChange}
                className={`w-full ${isAutoGenerated ? 'border-amber-300' : ''}`}
              />
              {isAutoGenerated && (
                <p className="text-xs text-amber-700">This value was automatically detected based on office holidays.</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </TableCell>
  );
};
