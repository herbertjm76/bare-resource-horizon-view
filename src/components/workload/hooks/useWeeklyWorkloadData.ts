
import { useState, useEffect, useMemo } from 'react';
import { useCompany } from '@/context/CompanyContext';
import { TeamMember } from '@/components/dashboard/types';
import { useComprehensiveAllocations } from '@/components/week-resourcing/hooks/useComprehensiveAllocations';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useOfficeHolidays } from './useOfficeHolidays';
import { format, startOfWeek, addWeeks, endOfWeek } from 'date-fns';

export interface WeeklyWorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export const useWeeklyWorkloadData = (selectedDate: Date, teamMembers: TeamMember[], periodWeeks: number = 4) => {
  const [weeklyWorkloadData, setWeeklyWorkloadData] = useState<Record<string, Record<string, WeeklyWorkloadBreakdown>>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  // Generate week start dates for the period
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

  // Fetch comprehensive allocations for all weeks in a single query
  const weekKeys = weekStartDates.map(w => w.key);
  const { data: allAllocationsData } = useQuery({
    queryKey: ['comprehensive-allocations-multiple', weekKeys, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const allocationsMap: Record<string, any[]> = {};
      
      // Fetch allocations for each week
      for (const weekKey of weekKeys) {
        const weekStart = new Date(weekKey);
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            *,
            projects (
              id,
              name,
              current_stage,
              end_date
            )
          `)
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .eq('week_start_date', weekKey);

        if (error) {
          console.error('Error fetching allocations for week', weekKey, error);
          continue;
        }

        allocationsMap[weekKey] = data || [];
      }

      return allocationsMap;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch leave data for all weeks in a single query
  const { data: allLeaveData } = useQuery({
    queryKey: ['annual-leave-multiple', weekKeys, memberIds, company?.id],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const startDate = weekStartDates[0]?.key;
      const endWeek = weekStartDates[weekStartDates.length - 1];
      const endDate = endWeek ? format(endOfWeek(endWeek.date, { weekStartsOn: 1 }), 'yyyy-MM-dd') : startDate;

      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        console.error('Error fetching annual leave:', error);
        return {};
      }

      // Group by week and member
      const leaveByWeek: Record<string, Array<{ member_id: string; hours: number; date: string }>> = {};
      
      data?.forEach(leave => {
        const leaveDate = new Date(leave.date);
        const weekStart = startOfWeek(leaveDate, { weekStartsOn: 1 });
        const weekKey = format(weekStart, 'yyyy-MM-dd');
        
        if (!leaveByWeek[weekKey]) {
          leaveByWeek[weekKey] = [];
        }
        
        leaveByWeek[weekKey].push({
          member_id: leave.member_id,
          hours: Number(leave.hours) || 0,
          date: leave.date
        });
      });

      return leaveByWeek;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch holiday data for the entire period
  const { data: holidaysData, isLoading: isLoadingHolidays } = useOfficeHolidays(
    selectedDate, 
    teamMembers, 
    company?.id, 
    periodWeeks
  );

  // Process and combine all data
  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      setWeeklyWorkloadData({});
      return;
    }

    console.log('🔍 WEEKLY WORKLOAD: Processing weekly workload data for', teamMembers.length, 'members');
    console.log('🔍 WEEKLY WORKLOAD: Period weeks:', periodWeeks);
    console.log('🔍 WEEKLY WORKLOAD: Week start dates:', weekStartDates.map(w => w.key));

    const processedData: Record<string, Record<string, WeeklyWorkloadBreakdown>> = {};

    // Initialize data structure
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
    if (allAllocationsData) {
      Object.keys(allAllocationsData).forEach(weekKey => {
        const allocations = allAllocationsData[weekKey] || [];
        allocations.forEach(allocation => {
          const memberId = allocation.resource_id;
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].projectHours += allocation.hours || 0;
          }
        });
      });
    }

    // Process annual leave
    if (allLeaveData) {
      Object.keys(allLeaveData).forEach(weekKey => {
        const leaveDetails = allLeaveData[weekKey] || [];
        leaveDetails.forEach(leave => {
          const memberId = leave.member_id;
          if (processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].annualLeave += leave.hours || 0;
          }
        });
      });
    }

    // Process office holidays
    if (holidaysData) {
      Object.keys(holidaysData).forEach(memberId => {
        Object.keys(holidaysData[memberId]).forEach(dateKey => {
          // Find which week this date belongs to
          const weekKey = weekStartDates.find(week => {
            const weekStart = new Date(week.key);
            const weekEnd = addWeeks(weekStart, 1);
            const checkDate = new Date(dateKey);
            return checkDate >= weekStart && checkDate < weekEnd;
          })?.key;

          if (weekKey && processedData[memberId] && processedData[memberId][weekKey]) {
            processedData[memberId][weekKey].officeHolidays += holidaysData[memberId][dateKey] || 0;
          }
        });
      });
    }

    // Calculate totals
    Object.keys(processedData).forEach(memberId => {
      Object.keys(processedData[memberId]).forEach(weekKey => {
        const weekData = processedData[memberId][weekKey];
        weekData.total = weekData.projectHours + weekData.annualLeave + weekData.officeHolidays + weekData.otherLeave;
      });
    });

    console.log('🔍 WEEKLY WORKLOAD: Final processed data:', processedData);
    setWeeklyWorkloadData(processedData);
    setIsLoadingWorkload(false);
  }, [company?.id, teamMembers, weekStartDates, allAllocationsData, allLeaveData, holidaysData]);

  return { 
    weeklyWorkloadData, 
    isLoadingWorkload, 
    weekStartDates 
  };
};
