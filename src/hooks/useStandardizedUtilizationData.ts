import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek } from 'date-fns';
import { UtilizationCalculationService, MemberUtilizationData, TeamUtilizationSummary } from '@/services/utilizationCalculationService';

interface UseStandardizedUtilizationDataProps {
  selectedWeek: Date;
  teamMembers: any[];
}

export const useStandardizedUtilizationData = ({ selectedWeek, teamMembers }: UseStandardizedUtilizationDataProps) => {
  const [memberUtilizations, setMemberUtilizations] = useState<MemberUtilizationData[]>([]);
  const [teamSummary, setTeamSummary] = useState<TeamUtilizationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    const fetchUtilizationData = async () => {
      if (!company?.id || !teamMembers.length) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
        
        // Fetch all required data in parallel
        const [
          projectAllocationsData,
          annualLeaveData,
          holidaysData,
          otherLeaveData
        ] = await Promise.all([
          // Project allocations
          supabase
            .from('project_resource_allocations')
            .select('resource_id, hours')
            .eq('company_id', company.id)
            .eq('week_start_date', weekStartDate)
            .in('resource_id', teamMembers.map(m => m.id)),
          
          // Annual leave
          supabase
            .from('annual_leaves')
            .select('member_id, hours')
            .eq('company_id', company.id)
            .gte('date', weekStartDate)
            .lt('date', format(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
            .in('member_id', teamMembers.map(m => m.id)),
          
          // Office holidays
          supabase
            .from('office_holidays')
            .select('*')
            .eq('company_id', company.id)
            .gte('date', weekStartDate)
            .lt('end_date', format(new Date(selectedWeek.getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')),
          
          // Other leave
          supabase
            .from('weekly_other_leave')
            .select('member_id, hours, leave_type')
            .eq('company_id', company.id)
            .eq('week_start_date', weekStartDate)
            .in('member_id', teamMembers.map(m => m.id))
        ]);

        // Process the data
        const memberUtilizationData: MemberUtilizationData[] = teamMembers.map(member => {
          // Calculate project hours
          const projectHours = projectAllocationsData.data
            ?.filter(allocation => allocation.resource_id === member.id)
            .reduce((sum, allocation) => sum + (allocation.hours || 0), 0) || 0;

          // Calculate annual leave hours
          const annualLeaveHours = annualLeaveData.data
            ?.filter(leave => leave.member_id === member.id)
            .reduce((sum, leave) => sum + (leave.hours || 0), 0) || 0;

          // Calculate office holiday hours (8 hours per day for holidays affecting member's location)
          const officeHolidayHours = holidaysData.data
            ?.filter(holiday => !holiday.location_id || holiday.location_id === member.location)
            .length * 8 || 0;

          // Calculate other leave hours
          const otherLeaveHours = otherLeaveData.data
            ?.filter(leave => leave.member_id === member.id)
            .reduce((sum, leave) => sum + (leave.hours || 0), 0) || 0;

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilizationData();
  }, [company?.id, selectedWeek, teamMembers]);

  return {
    memberUtilizations,
    teamSummary,
    isLoading,
    error
  };
};
