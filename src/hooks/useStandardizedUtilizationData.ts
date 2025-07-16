import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek } from 'date-fns';
import { UtilizationCalculationService, MemberUtilizationData, TeamUtilizationSummary } from '@/services/utilizationCalculationService';

interface UseStandardizedUtilizationDataProps {
  selectedWeek: Date;
  teamMembers: any[];
  timeRange?: { startDate: Date; endDate: Date };
}

export const useStandardizedUtilizationData = ({ selectedWeek, teamMembers, timeRange }: UseStandardizedUtilizationDataProps) => {
  const [memberUtilizations, setMemberUtilizations] = useState<MemberUtilizationData[]>([]);
  const [teamSummary, setTeamSummary] = useState<TeamUtilizationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    const fetchUtilizationData = async () => {
      if (!company?.id || !teamMembers.length) {
        setMemberUtilizations([]);
        setTeamSummary(null);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        
        // Use time range if provided, otherwise use selected week
        const queryStartDate = timeRange ? format(timeRange.startDate, 'yyyy-MM-dd') : weekStartDate;
        const queryEndDate = timeRange ? format(timeRange.endDate, 'yyyy-MM-dd') : format(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
        
        // Fetch all required data in parallel with error handling
        const [
          projectAllocationsData,
          annualLeaveData,
          holidaysData,
          otherLeaveData
        ] = await Promise.allSettled([
          // Project allocations - now respects time range
          supabase
            .from('project_resource_allocations')
            .select('resource_id, hours, week_start_date')
            .eq('company_id', company.id)
            .gte('week_start_date', queryStartDate)
            .lt('week_start_date', queryEndDate)
            .in('resource_id', teamMembers.map(m => m.id)),
          
          // Annual leave - now respects time range
          supabase
            .from('annual_leaves')
            .select('member_id, hours')
            .eq('company_id', company.id)
            .gte('date', queryStartDate)
            .lt('date', queryEndDate)
            .in('member_id', teamMembers.map(m => m.id)),
          
          // Office holidays - now respects time range
          supabase
            .from('office_holidays')
            .select('*')
            .eq('company_id', company.id)
            .gte('date', queryStartDate)
            .lt('end_date', queryEndDate),
          
          // Other leave - now respects time range
          supabase
            .from('weekly_other_leave')
            .select('member_id, hours, leave_type, week_start_date')
            .eq('company_id', company.id)
            .gte('week_start_date', queryStartDate)
            .lt('week_start_date', queryEndDate)
            .in('member_id', teamMembers.map(m => m.id))
        ]);

        // Process the data safely
        const memberUtilizationData: MemberUtilizationData[] = teamMembers.map(member => {
          // Calculate project hours
          const projectHours = projectAllocationsData.status === 'fulfilled' && projectAllocationsData.value.data
            ? projectAllocationsData.value.data
                .filter(allocation => allocation.resource_id === member.id)
                .reduce((sum, allocation) => sum + (allocation.hours || 0), 0)
            : 0;

          // Calculate annual leave hours
          const annualLeaveHours = annualLeaveData.status === 'fulfilled' && annualLeaveData.value.data
            ? annualLeaveData.value.data
                .filter(leave => leave.member_id === member.id)
                .reduce((sum, leave) => sum + (leave.hours || 0), 0)
            : 0;

          // Calculate office holiday hours (8 hours per day for holidays affecting member's location)
          const officeHolidayHours = holidaysData.status === 'fulfilled' && holidaysData.value.data
            ? holidaysData.value.data
                .filter(holiday => !holiday.location_id || holiday.location_id === member.location)
                .length * 8
            : 0;

          // Calculate other leave hours
          const otherLeaveHours = otherLeaveData.status === 'fulfilled' && otherLeaveData.value.data
            ? otherLeaveData.value.data
                .filter(leave => leave.member_id === member.id)
                .reduce((sum, leave) => sum + (leave.hours || 0), 0)
            : 0;

          return UtilizationCalculationService.calculateMemberUtilization(
            member,
            projectHours,
            annualLeaveHours,
            officeHolidayHours,
            otherLeaveHours
          );
        });

        const teamSummaryData = UtilizationCalculationService.calculateTeamUtilization(memberUtilizationData);

        setMemberUtilizations(memberUtilizationData);
        setTeamSummary(teamSummaryData);
      } catch (err) {
        console.error('Error fetching utilization data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch utilization data'));
        // Don't show loading indefinitely on error
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the function call to prevent excessive API calls
    const timeoutId = setTimeout(fetchUtilizationData, 300);
    
    return () => clearTimeout(timeoutId);
  }, [company?.id, format(selectedWeek, 'yyyy-MM-dd'), teamMembers.length, timeRange?.startDate, timeRange?.endDate]);

  return {
    memberUtilizations,
    teamSummary,
    isLoading,
    error
  };
};
