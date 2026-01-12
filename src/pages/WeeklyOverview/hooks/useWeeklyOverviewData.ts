import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useStreamlinedWeekResourceData } from '@/components/week-resourcing/hooks/useStreamlinedWeekResourceData';
import { useCustomCardTypes } from '@/hooks/useCustomCards';
import { format, addDays } from 'date-fns';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getWeekStartDate } from '@/components/weekly-overview/utils';
import { 
  DEMO_TEAM_MEMBERS, 
  DEMO_PRE_REGISTERED, 
  generateDemoAllocations, 
  generateDemoAnnualLeaves,
  DEMO_HOLIDAYS,
  DEMO_COMPANY_ID
} from '@/data/demoData';

type SortOption = 'alphabetical' | 'utilization' | 'location' | 'department';
type TableOrientation = 'per-person' | 'per-project';

interface UseWeeklyOverviewDataOptions {
  /** Table orientation - controls whether member filtering is applied */
  tableOrientation?: TableOrientation;
}

export const useWeeklyOverviewData = (
  selectedWeek: Date, 
  filters: any, 
  sortOption: SortOption = 'alphabetical',
  options: UseWeeklyOverviewDataOptions = {}
) => {
  const { tableOrientation = 'per-person' } = options;
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  const { startOfWorkWeek } = useAppSettings();

  // CRITICAL: Week boundaries must respect the company setting (startOfWorkWeek).
  // Otherwise saved allocations (normalized to company week start) won't appear in the UI.
  const weekStart = getWeekStartDate(selectedWeek, startOfWorkWeek);
  const weekEnd = addDays(weekStart, 6);
  const weekStartString = format(weekStart, 'yyyy-MM-dd');
  const weekEndString = format(weekEnd, 'yyyy-MM-dd');

  const companyId = isDemoMode ? DEMO_COMPANY_ID : company?.id;

  // Stable filters for data fetching
  const stableFilters = useMemo(() => ({ 
    practiceArea: filters.practiceArea === 'all' ? '' : filters.practiceArea,
    department: filters.department === 'all' ? '' : filters.department,
    location: filters.location === 'all' ? '' : filters.location,
    searchTerm: filters.searchTerm 
  }), [filters.practiceArea, filters.department, filters.location, filters.searchTerm]);

  // Core resource data (members, projects, allocations) - now with centralized sorting
  // Pass isProjectOriented to disable member filtering when viewing by project
  const isProjectOriented = tableOrientation === 'per-project';
  const resourceData = useStreamlinedWeekResourceData(selectedWeek, stableFilters, sortOption, { isProjectOriented });
  
  const memberIds = useMemo(() => 
    resourceData.allMembers?.map(m => m.id) || [],
    [resourceData.allMembers]
  );

  // Fetch profiles for available members row
  const { data: profiles = [] } = useQuery({
    queryKey: ['available-members-profiles', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_TEAM_MEMBERS.map(m => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: m.avatar_url,
          weekly_capacity: m.weekly_capacity,
          department: m.department,
          practice_area: m.practice_area,
          location: m.location
        }));
      }
      
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department, practice_area, location')
        .eq('company_id', company.id);
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch invites for available members row
  const { data: invites = [] } = useQuery({
    queryKey: ['available-members-invites', companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_PRE_REGISTERED.map(m => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: (m as any).avatar_url || null,
          weekly_capacity: m.weekly_capacity,
          department: m.department,
          practice_area: (m as any).practice_area || null,
          location: m.location
        }));
      }
      
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, avatar_url, weekly_capacity, department, practice_area, location')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch allocations for available members row
  const { data: availableMembersAllocations = [] } = useQuery({
    queryKey: ['available-allocations', weekStartString, companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        const demoAllocations = generateDemoAllocations();
        const weekEndDate = format(addDays(weekStart, 6), 'yyyy-MM-dd');
        
        return demoAllocations
          .filter(a => a.allocation_date >= weekStartString && a.allocation_date <= weekEndDate)
          .map(a => ({
            resource_id: a.resource_id,
            resource_type: a.resource_type,
            hours: a.hours,
            allocation_date: a.allocation_date,
            projects: {
              id: a.project_id,
              name: 'Project',
              code: 'PRJ',
              department: null
            }
          }));
      }
      
      if (!company?.id) return [];
      
      const weekEndLocal = new Date(weekStart);
      weekEndLocal.setDate(weekEndLocal.getDate() + 6);
      const weekEndDate = format(weekEndLocal, 'yyyy-MM-dd');
      
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
        .in('resource_type', ['active', 'pre_registered'])
        .gte('allocation_date', weekStartString)
        .lte('allocation_date', weekEndDate);
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch annual leaves for summary cards
  const { data: annualLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-leaves', weekStartString, weekEndString, companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        const demoLeaves = generateDemoAnnualLeaves();
        return demoLeaves
          .filter(l => l.date >= weekStartString && l.date <= weekEndString)
          .map(l => ({
            member_id: l.member_id,
            date: l.date,
            hours: l.hours
          }));
      }
      
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
    enabled: isDemoMode || !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch holidays for summary cards - this week + upcoming (next 3 months)
  const upcomingEndDate = format(addDays(weekEnd, 90), 'yyyy-MM-dd');
  
  const { data: holidays = [] } = useQuery({
    queryKey: ['weekly-summary-holidays', weekStartString, upcomingEndDate, companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        // Convert DEMO_HOLIDAYS to the expected format
        return DEMO_HOLIDAYS
          .filter(h => {
            const holidayDate = format(h.date, 'yyyy-MM-dd');
            return holidayDate >= weekStartString && holidayDate <= upcomingEndDate;
          })
          .map(h => ({
            id: h.id,
            date: format(h.date, 'yyyy-MM-dd'),
            name: h.name,
            end_date: null
          }));
      }
      
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('office_holidays')
        .select('id, date, name, end_date')
        .eq('company_id', company.id)
        .gte('date', weekStartString)
        .lte('date', upcomingEndDate)
        .order('date');
      
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || !!company?.id,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch other leaves for summary cards
  const { data: otherLeaves = [] } = useQuery({
    queryKey: ['weekly-summary-other-leaves', weekStartString, memberIds, companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        // Return empty for demo - could add demo other leaves if needed
        return [];
      }
      
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
    enabled: (isDemoMode || !!company?.id) && memberIds.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Fetch weekly notes for summary cards
  const { data: weeklyNotes = [] } = useQuery({
    queryKey: ['weekly-notes', weekStartString, companyId, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        // Return empty for demo - could add demo notes if needed
        return [];
      }
      
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
    enabled: isDemoMode || !!company?.id,
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
