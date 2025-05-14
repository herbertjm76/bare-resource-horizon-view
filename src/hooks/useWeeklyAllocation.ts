
import { useState, useEffect } from 'react';
import { startOfWeek } from 'date-fns';

interface WeeklyAllocation {
  memberId: string;
  projectCount: number;
  projectHours: number;
  vacationHours: number;
  generalOfficeHours: number;
  marketingHours: number;
  publicHolidayHours: number;
  medicalLeaveHours: number;
  annualLeaveHours: number;
  remarks: string;
}

export const useWeeklyAllocation = (selectedWeek: Date, memberId?: string) => {
  const [allocation, setAllocation] = useState<WeeklyAllocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAllocation = async () => {
      setIsLoading(true);
      
      try {
        // For now, we're just generating mock data
        // In a real implementation, we'd fetch this from Supabase
        const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
        
        // Mock data
        setTimeout(() => {
          setAllocation({
            memberId: memberId || '',
            projectCount: Math.floor(Math.random() * 3),
            projectHours: Math.floor(Math.random() * 40),
            vacationHours: Math.floor(Math.random() * 8),
            generalOfficeHours: Math.floor(Math.random() * 5),
            marketingHours: Math.floor(Math.random() * 3),
            publicHolidayHours: 0,
            medicalLeaveHours: 0,
            annualLeaveHours: Math.floor(Math.random() * 8),
            remarks: '',
          });
          setIsLoading(false);
        }, 300);
        
      } catch (error) {
        console.error('Error fetching weekly allocation:', error);
        setIsLoading(false);
      }
    };

    fetchAllocation();
  }, [selectedWeek, memberId]);

  return { allocation, isLoading };
};
