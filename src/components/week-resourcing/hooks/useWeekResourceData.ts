
import { format, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { useWeekResourceTeamMembers } from './useWeekResourceTeamMembers';
import { useWeekResourceProjects } from './useWeekResourceProjects';
import { useWeekResourceAllocations } from './useWeekResourceAllocations';
import { useWeekResourceLeaveData } from './useWeekResourceLeaveData';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface UseWeekResourceDataProps {
  weekStartDate: string;
  filters: {
    office: string;
    searchTerm?: string;
  };
}

export const useWeekResourceData = (weekStartDate: string, filters: UseWeekResourceDataProps['filters']) => {
  const { company } = useCompany();
  
  // Get team members (both active and pre-registered)
  const {
    members,
    loadingMembers,
    membersError
  } = useWeekResourceTeamMembers();

  // Get projects for the company
  const {
    data: projects,
    isLoading: isLoadingProjects,
    error: projectsError
  } = useWeekResourceProjects({ filters });

  // Get resource allocations for the selected week
  const {
    data: weekAllocations,
    isLoading: isLoadingAllocations
  } = useWeekResourceAllocations({ weekStartDate });

  // Get leave data (annual leave and holidays)
  const memberIds = members.map(m => m.id);
  const {
    annualLeaveData,
    holidaysData,
    isLoading: isLoadingLeaveData
  } = useWeekResourceLeaveData({ weekStartDate, memberIds });

  // Fetch detailed annual leave data for the week to get individual dates
  const { data: weeklyLeaveDetails } = useQuery({
    queryKey: ['weekly-leave-details', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return {};

      const weekStart = new Date(weekStartDate);
      const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

      console.log('Fetching detailed annual leave for week:', weekStartDate);

      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .in('member_id', memberIds)
        .gte('date', format(weekStart, 'yyyy-MM-dd'))
        .lte('date', format(weekEnd, 'yyyy-MM-dd'));

      if (error) {
        console.error('Error fetching detailed annual leave:', error);
        return {};
      }

      // Group by member
      const leaveByMember: Record<string, Array<{ date: string; hours: number }>> = {};
      data?.forEach(leave => {
        if (!leaveByMember[leave.member_id]) {
          leaveByMember[leave.member_id] = [];
        }
        leaveByMember[leave.member_id].push({
          date: leave.date,
          hours: Number(leave.hours) || 0
        });
      });

      console.log('Detailed leave data processed:', leaveByMember);
      return leaveByMember;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Fetch comprehensive weekly allocations for BOTH active and pre-registered members
  const { data: comprehensiveWeeklyAllocations } = useQuery({
    queryKey: ['comprehensive-weekly-allocations', weekStartDate, company?.id, memberIds],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return [];

      console.log('=== FETCHING COMPREHENSIVE WEEKLY ALLOCATIONS ===');
      console.log('Week starting:', weekStartDate);
      console.log('All member IDs (active + pre-registered):', memberIds);

      // Fetch allocations for both active and pre-registered members
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('resource_id, project_id, hours, week_start_date, resource_type')
        .eq('company_id', company.id)
        .in('resource_id', memberIds)
        .eq('week_start_date', weekStartDate)
        .in('resource_type', ['active', 'pre_registered']);

      if (error) {
        console.error('Error fetching comprehensive weekly allocations:', error);
        return [];
      }

      console.log('Raw comprehensive weekly allocations fetched:', data?.length || 0);
      console.log('All allocation data:', data);
      
      // Filter for allocations with hours > 0
      const activeAllocations = data?.filter(allocation => 
        Number(allocation.hours) > 0
      ) || [];
      
      console.log('Filtered allocations with hours > 0:', activeAllocations.length);
      console.log('Allocations by member and type:', activeAllocations.reduce((acc, allocation) => {
        const memberId = allocation.resource_id;
        const key = `${memberId} (${allocation.resource_type})`;
        if (!acc[key]) acc[key] = [];
        acc[key].push({
          project_id: allocation.project_id,
          hours: allocation.hours
        });
        return acc;
      }, {} as Record<string, any[]>));

      return activeAllocations;
    },
    enabled: !!company?.id && memberIds.length > 0
  });

  // Create allocation map for easy lookup
  const allocationMap = new Map<string, number>();
  if (weekAllocations) {
    weekAllocations.forEach(allocation => {
      const key = `${allocation.resource_id}:${allocation.project_id}`;
      allocationMap.set(key, allocation.hours);
    });
  }

  // Calculate weekly totals per member from comprehensive allocations (including pre-registered)
  const memberWeeklyTotals = new Map<string, number>();
  if (comprehensiveWeeklyAllocations) {
    comprehensiveWeeklyAllocations.forEach(allocation => {
      const memberId = allocation.resource_id;
      const hours = Number(allocation.hours) || 0;
      const currentTotal = memberWeeklyTotals.get(memberId) || 0;
      memberWeeklyTotals.set(memberId, currentTotal + hours);
    });
  }

  console.log('=== UPDATED WEEKLY TOTALS CALCULATION ===');
  console.log('Week start date:', weekStartDate);
  console.log('Member weekly totals (active + pre-registered):', Object.fromEntries(memberWeeklyTotals));
  console.log('Total members with allocations:', memberWeeklyTotals.size);
  console.log('All members in system:', members.map(m => ({ 
    id: m.id, 
    name: `${m.first_name} ${m.last_name}`,
    total: memberWeeklyTotals.get(m.id) || 0
  })));

  // Utility function to get member total hours (now includes pre-registered)
  const getMemberTotal = (memberId: string): number => {
    const total = memberWeeklyTotals.get(memberId) || 0;
    console.log(`=== MEMBER TOTAL LOOKUP (UPDATED) ===`);
    console.log(`Member ${memberId} weekly total hours:`, total);
    
    // Also log the individual allocations for this member for debugging
    const memberAllocations = comprehensiveWeeklyAllocations?.filter(a => a.resource_id === memberId) || [];
    console.log(`Member ${memberId} individual allocations:`, memberAllocations.map(a => ({
      project_id: a.project_id,
      hours: a.hours,
      resource_type: a.resource_type,
      week_start_date: a.week_start_date
    })));
    
    return total;
  };

  // Utility function to get project count for a member (including pre-registered)
  const getProjectCount = (memberId: string): number => {
    let count = 0;
    if (comprehensiveWeeklyAllocations) {
      // Count unique projects this member is allocated to during the week
      const memberProjects = new Set();
      comprehensiveWeeklyAllocations
        .filter(allocation => allocation.resource_id === memberId && (Number(allocation.hours) || 0) > 0)
        .forEach(allocation => memberProjects.add(allocation.project_id));
      count = memberProjects.size;
    }
    console.log(`Member ${memberId} project count (active + pre-registered):`, count);
    return count;
  };

  // Utility function to get weekly leave dates - now properly implemented
  const getWeeklyLeave = (memberId: string): Array<{ date: string; hours: number }> => {
    if (!weeklyLeaveDetails || !weeklyLeaveDetails[memberId]) {
      return [];
    }
    
    // Sort by date and return
    return weeklyLeaveDetails[memberId].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Determine overall loading state
  const isLoading = isLoadingProjects || loadingMembers || isLoadingAllocations || isLoadingLeaveData;
  
  // Handle errors
  const error = projectsError || membersError;

  return {
    projects: projects || [],
    members,
    allocations: weekAllocations || [],
    allocationMap,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    annualLeaveData,
    holidaysData,
    weekStartDate,
    isLoading,
    error
  };
};
