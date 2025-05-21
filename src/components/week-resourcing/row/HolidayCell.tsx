
import React, { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { format, isWithinInterval, parseISO, addDays } from 'date-fns';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';

interface HolidayCellProps {
  holidayHours: number;
  memberId: string;
  memberOffice?: string;
  weekStartDate: string;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
}

interface Holiday {
  id: string;
  name: string;
  date: Date;
  offices: string[];
  location_id?: string;
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
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  
  // Fetch holidays from the database
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const { data, error } = await supabase
          .from('office_holidays')
          .select('*');
          
        if (error) throw error;
        
        // Transform the data format
        const transformedHolidays: Holiday[] = data.map(holiday => ({
          id: holiday.id,
          name: holiday.name,
          date: new Date(holiday.date),
          offices: holiday.location_id ? [holiday.location_id] : [],
          location_id: holiday.location_id
        }));
        
        setHolidays(transformedHolidays);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    
    fetchHolidays();
  }, []);
  
  // Function to calculate holiday hours based on fetched holidays
  const calculateHolidayHours = () => {
    if (!memberOffice || !holidays.length) return 0;
    
    try {
      // Find the location id for the member's office
      const locationObj = locations.find(loc => loc.city === memberOffice || loc.code === memberOffice);
      if (!locationObj) return 0;
      
      // Get the week range
      const weekStart = new Date(weekStartDate);
      const weekEnd = addDays(weekStart, 6);
      
      // Filter holidays that match the member's office and fall within the week
      const applicableHolidays = holidays.filter(holiday => {
        // Check if holiday applies to this member's office
        // Either check the offices array or the location_id field
        const holidayOffices = holiday.offices?.length > 0 
          ? holiday.offices 
          : (holiday.location_id ? [holiday.location_id] : []);

        if (!holidayOffices.includes(locationObj.id)) {
          return false;
        }
        
        // Check for holiday date within the week
        const holidayDate = holiday.date;
        return (
          holidayDate >= weekStart && holidayDate <= weekEnd
        );
      });
      
      if (applicableHolidays.length > 0) {
        // Collect holiday names for tooltip
        setHolidayNames(applicableHolidays.map(h => h.name));
        
        // Calculate business days in the holiday period that fall within this week
        let holidayDays = 0;
        
        // Count number of holidays within the week that are business days
        applicableHolidays.forEach(holiday => {
          const holidayDate = holiday.date;
          const dayOfWeek = holidayDate.getDay();
          
          // Check if this day is a business day (not Sat/Sun)
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            holidayDays++;
          }
        });
        
        // Assuming 8 hours per holiday day
        return holidayDays * 8;
      }
      
      return 0;
    } catch (err) {
      console.error("Error processing holidays:", err);
      return 0;
    }
  };
  
  // Auto-detect holidays when component mounts or when weekStartDate/memberOffice/holidays changes
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
  }, [weekStartDate, memberOffice, memberId, holidays]);
  
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
