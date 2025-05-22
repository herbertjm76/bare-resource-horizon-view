
import React, { useState, useEffect } from 'react';
import { TableCell } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useOfficeSettings } from '@/context/OfficeSettingsContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { fetchHolidays } from '@/components/settings/holidays/HolidayService';
import { Holiday } from '@/components/settings/holidays/types';
import { useCompany } from "@/context/CompanyContext";

interface HolidayCellProps {
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
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const { company } = useCompany();
  
  // Fetch holidays from the database
  useEffect(() => {
    const loadHolidays = async () => {
      if (!company) return;
      
      try {
        const holidaysData = await fetchHolidays(company.id);
        setHolidays(holidaysData);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    
    loadHolidays();
  }, [company]);
  
  // Function to calculate holiday hours based on fetched holidays
  const calculateHolidayHours = () => {
    if (!memberOffice || !holidays.length) return 0;
    
    try {
      // Find the location id for the member's office
      const locationObj = locations.find(loc => loc.city === memberOffice || loc.code === memberOffice);
      if (!locationObj) return 0;
      
      // Get the week range
      const weekStart = new Date(weekStartDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      // Filter holidays that match the member's office and fall within the week
      const applicableHolidays = holidays.filter(holiday => {
        // Check if holiday applies to this member's office
        if (holiday.location_id !== locationObj.id) {
          return false;
        }
        
        // Check for holiday date within the week
        const holidayDate = new Date(holiday.date);
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
          const holidayDate = new Date(holiday.date);
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
