import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfWeek, addWeeks, endOfWeek } from 'date-fns';

export interface WeeklyWorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export const useWeeklyWorkloadData = (selectedDate: Date, teamMembers: TeamMember[], periodWeeks: number = 36) => {
  const { company } = useCompany();

  // Generate week start dates for the period, starting from the selected week
  const weekStartDates = useMemo(() => {
    const weeks = [];
    const startWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
    
    for (let i = 0; i < periodWeeks; i++) {
      const weekStart = addWeeks(startWeek, i);
      weeks.push({
        date: weekStart,
        key: format(weekStart, 'yyyy-MM-dd')
      });
    }
    
    return weeks;
  }, [selectedDate, periodWeeks]);

  // Get member IDs
  const memberIds = useMemo(() => teamMembers.map(member => member.id), [teamMembers]);

  // Single comprehensive query to fetch all workload data at once
  const { data: workloadData, isLoading: isLoadingWorkload } = useQuery({
    queryKey: ['weekly-workload-comprehensive', weekStartDates.map(w => w.key), memberIds, company?.id],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      console.log('🔍 WEEKLY WORKLOAD: Starting comprehensive data fetch...');
      
      const startDate = weekStartDates[0]?.key;
      const endWeek = weekStartDates[weekStartDates.length - 1];
      const endDate = endWeek ? format(endOfWeek(endWeek.date, { weekStartsOn: 1 }), 'yyyy-MM-dd') : startDate;

      // Fetch all data in parallel
      const [allocationsResult, leaveResult, holidaysResult, otherLeaveResult] = await Promise.all([
        // Project allocations
        supabase
          .from('project_resource_allocations')
          .select(`
            resource_id,
            week_start_date,
            hours,
            projects (
              id,
              name,
              current_stage
            )
          `)
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .in('week_start_date', weekStartDates.map(w => w.key)),

        // Annual leave
        supabase
          .from('annual_leaves')
          .select('member_id, date, hours')
          .eq('company_id', company.id)
          .in('member_id', memberIds)
          .gte('date', startDate)
          .lte('date', endDate),

        // Office holidays
        supabase
          .from('office_holidays')
          .select('date, end_date, name, location_id')
          .eq('company_id', company.id)
          .gte('date', startDate)
          .lte('date', endDate),

        // Other leave
        supabase
          .from('weekly_other_leave')
          .select('member_id, week_start_date, hours, leave_type')
          .eq('company_id', company.id)
          .in('member_id', memberIds)
          .in('week_start_date', weekStartDates.map(w => w.key))
      ]);

      console.log('🔍 WEEKLY WORKLOAD: Raw data fetched:', {
        allocations: allocationsResult.data?.length || 0,
        leave: leaveResult.data?.length || 0,
        holidays: holidaysResult.data?.length || 0,
        otherLeave: otherLeaveResult.data?.length || 0
      });

      // Initialize the workload data structure
      const processedData: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};
      
      teamMembers.forEach(member => {
        processedData[member.id] = {};
        weekStartDates.forEach(week => {
          processedData[member.id][week.key] = {
            projectHours: 0,
            annualLeave: 0,
            officeHolidays: 0,
            otherLeave: 0,
            total: 0
          };
        });
      });

      // Process project allocations
      if (allocationsResult.data) {
        allocationsResult.data.forEach(allocation => {
          const memberId = allocation.resource_id;
          const weekKey = allocation.week_start_date;
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].projectHours += allocation.hours || 0;
          }
        });
      }

      // Process annual leave - group by week
      if (leaveResult.data) {
        leaveResult.data.forEach(leave => {
          const leaveDate = new Date(leave.date);
          const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
          const weekKey = format(weekStart, 'yyyy-MM-dd');
          const memberId = leave.member_id;
          
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].annualLeave += Number(leave.hours) || 0;
          }
        });
      }

      // Process office holidays - calculate hours for each member
      if (holidaysResult.data) {
        holidaysResult.data.forEach(holiday => {
          const holidayStart = new Date(holiday.date);
          const holidayEnd = holiday.end_date ? new Date(holiday.end_date) : holidayStart;
          
          // Calculate days in holiday period
          const daysDiff = Math.ceil((holidayEnd.getTime() - holidayStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;
          
          teamMembers.forEach(member => {
            // Check if member is affected by this holiday (location-based logic can be added here)
            const weeklyCapacity = member.weekly_capacity || 40;
            const dailyHours = weeklyCapacity / 5; // Assuming 5 working days per week
            
            for (let d = 0; d < daysDiff; d++) {
              const currentDate = new Date(holidayStart);
              currentDate.setDate(currentDate.getDate() + d);
              
              // Skip weekends
              if (currentDate.getDay() === 0 || currentDate.getDay() === 6) continue;
              
              const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
              const weekKey = format(weekStart, 'yyyy-MM-dd');
              
              if (processedData[member.id] && processedData[member.id][weekKey]) {
                processedData[member.id][weekKey].officeHolidays += dailyHours;
              }
            }
          });
        });
      }

      // Process other leave
      if (otherLeaveResult.data) {
        otherLeaveResult.data.forEach(leave => {
          const memberId = leave.member_id;
          const weekKey = leave.week_start_date;
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].otherLeave += leave.hours || 0;
          }
        });
      }

      // Calculate totals
      Object.keys(processedData).forEach(memberId => {
        Object.keys(processedData[memberId]).forEach(weekKey => {
          const weekData = processedData[memberId][weekKey];
          weekData.total = weekData.projectHours + weekData.annualLeave + weekData.officeHolidays + weekData.otherLeave;
        });
      });

      console.log('🔍 WEEKLY WORKLOAD: Final processed data completed');
      return processedData;
    },
    enabled: !!company?.id && memberIds.length > 0,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });

  // Return the data in the expected format
  const weeklyWorkloadData = workloadData || {};

  return { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  };
};
