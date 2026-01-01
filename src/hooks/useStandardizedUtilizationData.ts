import { useState, useEffect } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek } from 'date-fns';
import { UtilizationCalculationService, MemberUtilizationData, TeamUtilizationSummary } from '@/services/utilizationCalculationService';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAllocations, generateDemoAnnualLeaves, DEMO_TEAM_MEMBERS } from '@/data/demoData';

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
  const { isDemoMode } = useDemoAuth();

  useEffect(() => {
    const fetchUtilizationData = async () => {
      // Handle demo mode
      if (isDemoMode) {
        try {
          setIsLoading(true);
          
          const demoAllocations = generateDemoAllocations();
          const demoAnnualLeaves = generateDemoAnnualLeaves();
          const demoMembers = teamMembers.length > 0 ? teamMembers : DEMO_TEAM_MEMBERS;
          
          const weekStartDate = format(startOfWeek(selectedWeek, { weekStartsOn: 1 }), 'yyyy-MM-dd');
          const weekEndDate = format(new Date(new Date(weekStartDate).getTime() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
          
          // Calculate utilization from demo data
          const memberUtilizationData: MemberUtilizationData[] = demoMembers.map(member => {
            // Get allocations for this member in the selected week
            const memberAllocations = demoAllocations.filter(
              alloc => alloc.resource_id === member.id && 
                       alloc.allocation_date >= weekStartDate && 
                       alloc.allocation_date < weekEndDate
            );
            
            const projectHours = memberAllocations.reduce((sum, alloc) => sum + alloc.hours, 0);
            
            // Get annual leaves for this member
            const memberLeaves = demoAnnualLeaves.filter(
              leave => leave.member_id === member.id &&
                       leave.date >= weekStartDate &&
                       leave.date < weekEndDate
            );
            const annualLeaveHours = memberLeaves.reduce((sum, leave) => sum + leave.hours, 0);
            
            return UtilizationCalculationService.calculateMemberUtilization(
              member,
              projectHours,
              annualLeaveHours,
              0, // No office holidays for demo
              0  // No other leave for demo
            );
          });

          const teamSummaryData = UtilizationCalculationService.calculateTeamUtilization(memberUtilizationData);

          setMemberUtilizations(memberUtilizationData);
          setTeamSummary(teamSummaryData);
          setIsLoading(false);
          return;
        } catch (err) {
          logger.error('Error calculating demo utilization:', err);
          setError(err instanceof Error ? err : new Error('Failed to calculate demo utilization'));
          setIsLoading(false);
          return;
        }
      }

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
            .select('resource_id, hours, allocation_date')
            .eq('company_id', company.id)
            .gte('allocation_date', queryStartDate)
            .lt('allocation_date', queryEndDate)
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

        // Calculate number of weeks in the time range
        const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
        const startTime = timeRange ? timeRange.startDate.getTime() : new Date(queryStartDate).getTime();
        const endTime = timeRange ? timeRange.endDate.getTime() : new Date(queryEndDate).getTime();
        const numberOfWeeks = Math.max(1, Math.ceil((endTime - startTime) / millisecondsInWeek));
        
        logger.log('UTILIZATION CALCULATION:', {
          queryStartDate,
          queryEndDate,
          numberOfWeeks,
          timeRangeProvided: !!timeRange
        });

        // Process the data safely
        const memberUtilizationData: MemberUtilizationData[] = teamMembers.map(member => {
          // Calculate total project hours across all weeks
          const totalProjectHours = projectAllocationsData.status === 'fulfilled' && projectAllocationsData.value.data
            ? projectAllocationsData.value.data
                .filter(allocation => allocation.resource_id === member.id)
                .reduce((sum, allocation) => sum + (allocation.hours || 0), 0)
            : 0;

          // Calculate average project hours per week
          const projectHours = totalProjectHours / numberOfWeeks;

          // Calculate total annual leave hours
          const totalAnnualLeaveHours = annualLeaveData.status === 'fulfilled' && annualLeaveData.value.data
            ? annualLeaveData.value.data
                .filter(leave => leave.member_id === member.id)
                .reduce((sum, leave) => sum + (leave.hours || 0), 0)
            : 0;
          
          // Calculate average annual leave hours per week
          const annualLeaveHours = totalAnnualLeaveHours / numberOfWeeks;

          // Calculate office holiday hours (8 hours per day for holidays affecting member's location)
          const totalOfficeHolidayHours = holidaysData.status === 'fulfilled' && holidaysData.value.data
            ? holidaysData.value.data
                .filter(holiday => !holiday.location_id || holiday.location_id === member.location)
                .length * 8
            : 0;
          
          // Calculate average office holiday hours per week
          const officeHolidayHours = totalOfficeHolidayHours / numberOfWeeks;

          // Calculate total other leave hours
          const totalOtherLeaveHours = otherLeaveData.status === 'fulfilled' && otherLeaveData.value.data
            ? otherLeaveData.value.data
                .filter(leave => leave.member_id === member.id)
                .reduce((sum, leave) => sum + (leave.hours || 0), 0)
            : 0;
          
          // Calculate average other leave hours per week
          const otherLeaveHours = totalOtherLeaveHours / numberOfWeeks;
          
          logger.log(`${member.first_name} ${member.last_name}:`, {
            totalProjectHours,
            numberOfWeeks,
            averageProjectHours: projectHours,
            utilizationCalculatedFrom: 'average per week'
          });

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
        logger.error('Error fetching utilization data:', err);
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
  }, [company?.id, format(selectedWeek, 'yyyy-MM-dd'), teamMembers.length, timeRange?.startDate, timeRange?.endDate, isDemoMode]);

  return {
    memberUtilizations,
    teamSummary,
    isLoading,
    error
  };
};
