import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useStreamlinedWeekResourceData } from '@/components/week-resourcing/hooks/useStreamlinedWeekResourceData';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { format, startOfWeek, endOfWeek } from 'date-fns';

export const useWeeklyOverviewData = (selectedWeek: Date, filters: any) => {
  const { company } = useCompany();
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekStartString = format(weekStart, 'yyyy-MM-dd');
  const weekEndString = format(weekEnd, 'yyyy-MM-dd');

  // Stable filters for data fetching
  const stableFilters = useMemo(() => ({ 
    practiceArea: filters.practiceArea === 'all' ? '' : filters.practiceArea,
    department: filters.department === 'all' ? '' : filters.department,
    location: filters.location === 'all' ? '' : filters.location,
    searchTerm: filters.searchTerm 
  }), [filters.practiceArea, filters.department, filters.location, filters.searchTerm]);

  // Core resource data (members, projects, allocations)
  const resourceData = useStreamlinedWeekResourceData(selectedWeek, stableFilters);
  
  const memberIds = useMemo(() => 
    resourceData.allMembers?.map(m => m.id) || [],
    [resourceData.allMembers]
  );

  // Fetch profiles for available members row
  const { data: profiles = [] } = useQuery({
    queryKey: ['available-members-profiles', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department')
        .eq('company_id', company.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch invites for available members row
  const { data: invites = [] } = useQuery({
    queryKey: ['available-members-invites', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch allocations for available members row
  const { data: availableMembersAllocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      const weekEndDate = format(weekEnd, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id, 
          resource_type, 
          hours,
          allocation_date,
          projects:project_id (
            id,
            name,
            code,
            department
          )
        `)
        .eq('company_id', company.id)
        .gte('allocation_date', weekStartString)
        .lte('allocation_date', weekEndDate);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch annual leaves for summary cards
  const { data: annualLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-leaves', weekStartString, weekEndString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('annual_leaves')
        .select('member_id, date, hours')
        .eq('company_id', company.id)
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch holidays for summary cards
  const { data: holidays = [] } = useQuery({
    queryKey: ['weekly-summary-holidays', weekStartString, weekEndString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('office_holidays')
        .select('id, date, name, end_date')
        .eq('company_id', company.id)
        .gte('date', weekStartString)
        .lte('date', weekEndString);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch other leaves for summary cards
  const { data: otherLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-other-leaves', weekStartString, memberIds, company?.id],
    queryFn: async () => {
      if (!company?.id || memberIds.length === 0) return [];

      const { data, error } = await supabase
        .from('weekly_other_leave')
        .select('member_id, hours, leave_type, notes')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartString)
        .in('member_id', memberIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && memberIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch weekly notes for summary cards
  const { data: weeklyNotes = [] } = useQuery({
    queryKey: ['weekly-notes', weekStartString, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('weekly_notes')
        .select('id, start_date, end_date, description')
        .eq('company_id', company.id)
        .eq('week_start_date', weekStartString)
        .order('start_date');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch custom card types
  const { data: customCardTypes = [] } = useCustomCardTypes();

  return {
    // Core resource data
    ...resourceData,
    memberIds,
    
    // Available members data
    profiles,
    invites,
    availableMembersAllocations,
    
    // Summary card data
    annualLeaves,
    holidays,
    otherLeaves,
    weeklyNotes,
    customCardTypes,
    
    // Date strings
    weekStartString,
    weekEndString,
  };
};
