
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/dashboard/types';
import { format, startOfWeek, addWeeks, addDays } from 'date-fns';

export const useOfficeHolidays = (
  selectedDate: Date, 
  teamMembers: TeamMember[], 
  companyId?: string,
  periodWeeks: number = 1
) => {
  return useQuery({
    queryKey: ['office-holidays', selectedDate, companyId, periodWeeks],
    queryFn: async () => {
      if (!companyId || teamMembers.length === 0) return {};

      console.log('🔍 OFFICE HOLIDAYS: Fetching for', periodWeeks, 'weeks starting', format(selectedDate, 'yyyy-MM-dd'));

      // Generate date range for all weeks
      const startWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
      const endWeek = addWeeks(startWeek, periodWeeks);
      const startDateString = format(startWeek, 'yyyy-MM-dd');
      const endDateString = format(endWeek, 'yyyy-MM-dd');

      console.log('🔍 OFFICE HOLIDAYS: Date range:', startDateString, 'to', endDateString);

      // Get all unique locations from team members
      const locations = [...new Set(teamMembers.map(member => member.location).filter(Boolean))];
      
      if (locations.length === 0) {
        console.log('🔍 OFFICE HOLIDAYS: No locations found for team members');
        return {};
      }

      // Fetch office holidays for the date range and locations
      const { data: holidays, error } = await supabase
        .from('office_holidays')
        .select('*')
        .eq('company_id', companyId)
        .gte('date', startDateString)
        .lt('date', endDateString)
        .in('location_id', locations);

      if (error) {
        console.error('Error fetching office holidays:', error);
        return {};
      }

      console.log('🔍 OFFICE HOLIDAYS: Found', holidays?.length || 0, 'holidays');

      // Create holiday data structure
      const holidayData: Record<string, Record<string, number>> = {};

      // Initialize structure for all team members
      teamMembers.forEach(member => {
        holidayData[member.id] = {};
      });

      // Process holidays and distribute to team members
      holidays?.forEach(holiday => {
        const holidayDate = format(new Date(holiday.date), 'yyyy-MM-dd');
        
        // Find team members in this location
        const membersInLocation = teamMembers.filter(member => member.location === holiday.location_id);
        
        membersInLocation.forEach(member => {
          if (!holidayData[member.id][holidayDate]) {
            holidayData[member.id][holidayDate] = 0;
          }
          // Assume 8 hours per holiday day
          holidayData[member.id][holidayDate] += 8;
        });
      });

      console.log('🔍 OFFICE HOLIDAYS: Final holiday data structure:', holidayData);
      return holidayData;
    },
    enabled: !!companyId && teamMembers.length > 0
  });
};
