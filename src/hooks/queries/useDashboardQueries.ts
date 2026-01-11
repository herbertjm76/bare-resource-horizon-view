import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAppSettings } from '@/hooks/useAppSettings';
import { TimeRange } from '@/components/dashboard/TimeRangeSelector';
import { startOfWeek, startOfMonth, subMonths, format } from 'date-fns';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import DEMO_DATA, { 
  DEMO_TEAM_MEMBERS, 
  DEMO_PROJECTS, 
  DEMO_PRE_REGISTERED, 
  DEMO_TEAM_COMPOSITION,
  DEMO_STAGES,
  DEMO_LOCATIONS,
  DEMO_METRICS,
  generateDemoHolidays
} from '@/data/demoData';

// Single source of truth for all dashboard data fetching using React Query

export const useDashboardTeamMembers = (companyId?: string) => {
  const { isDemoMode } = useDemoAuth();
  
  return useQuery({
    queryKey: ['team-members', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        return DEMO_TEAM_MEMBERS;
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId)
        .order('first_name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useDashboardPreRegistered = (companyId?: string) => {
  const { isDemoMode } = useDemoAuth();
  
  return useQuery({
    queryKey: ['pre-registered-members', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        return DEMO_PRE_REGISTERED;
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .eq('invitation_type', 'pre_registered');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardProjects = (companyId?: string) => {
  const { isDemoMode } = useDemoAuth();
  
  return useQuery({
    queryKey: ['projects', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        return DEMO_PROJECTS;
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('company_id', companyId)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardTeamComposition = (companyId?: string) => {
  const { isDemoMode } = useDemoAuth();
  
  return useQuery({
    queryKey: ['team-composition', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        return DEMO_TEAM_COMPOSITION;
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('project_team_composition')
        .select('*')
        .eq('company_id', companyId);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 5 * 60 * 1000,
  });
};

export const useDashboardHolidays = (companyId?: string) => {
  const { isDemoMode } = useDemoAuth();
  
  return useQuery({
    queryKey: ['holidays', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        const holidays = generateDemoHolidays();
        return holidays.map(holiday => ({
          id: holiday.id,
          name: holiday.name,
          date: holiday.date,
          office: holiday.office_locations 
            ? `${holiday.office_locations.city}, ${holiday.office_locations.country}`
            : 'All Offices',
          type: 'company' as const
        }));
      }
      
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('office_holidays')
        .select(`
          id,
          name,
          date,
          office_locations (city, country)
        `)
        .eq('company_id', companyId)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      
      return (data || []).map(holiday => ({
        id: holiday.id,
        name: holiday.name,
        date: holiday.date,
        office: holiday.office_locations 
          ? `${holiday.office_locations.city}, ${holiday.office_locations.country}`
          : 'All Offices',
        type: 'company' as const
      }));
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

const getDateRangeForTimeRange = (timeRange: TimeRange) => {
  const now = new Date();
  let startDate: Date;
  
  switch (timeRange) {
    case 'week':
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      break;
    case 'month':
      startDate = startOfMonth(now);
      break;
    case '3months':
      startDate = subMonths(startOfMonth(now), 3);
      break;
    default:
      startDate = startOfMonth(now);
  }
  
  return {
    startDate: format(startDate, 'yyyy-MM-dd'),
    endDate: format(now, 'yyyy-MM-dd')
  };
};

export const useDashboardMetrics = (companyId?: string, timeRange: TimeRange = 'month') => {
  const { workWeekHours } = useAppSettings();
  const { isDemoMode } = useDemoAuth();
  const dateRange = getDateRangeForTimeRange(timeRange);
  
  return useQuery({
    queryKey: ['dashboard-metrics', companyId, timeRange, isDemoMode],
    queryFn: async () => {
      // Return demo metrics in demo mode
      if (isDemoMode) {
        return DEMO_METRICS;
      }
      
      if (!companyId) return null;
      
      // Fetch all data in parallel
      const [projectsRes, locationsRes, stagesRes, teamRes, feesRes, allocationsRes] = await Promise.all([
        supabase
          .from('projects')
          .select('id, name, status, current_stage, country, temp_office_location_id, project_manager_id, project_manager:profiles!project_manager_id(first_name, last_name)')
          .eq('company_id', companyId),
        supabase
          .from('office_locations')
          .select('id, city, country, emoji')
          .eq('company_id', companyId),
        supabase
          .from('office_stages')
          .select('id, name, color')
          .eq('company_id', companyId),
        supabase
          .from('profiles')
          .select('id')
          .eq('company_id', companyId),
        supabase
          .from('project_stages')
          .select('fee, project_id, created_at')
          .eq('company_id', companyId)
          .gte('created_at', dateRange.startDate)
          .lte('created_at', dateRange.endDate),
        // RULEBOOK: Filter by resource_type='active' for dashboard metrics
        supabase
          .from('project_resource_allocations')
          .select('hours, allocation_date, resource_id, project_id')
          .eq('company_id', companyId)
          .eq('resource_type', 'active')
          .gte('allocation_date', dateRange.startDate)
          .lte('allocation_date', dateRange.endDate)
      ]);
      
      const projects = projectsRes.data || [];
      const locations = locationsRes.data || [];
      const stages = stagesRes.data || [];
      const teamMembers = teamRes.data || [];
      const fees = feesRes.data || [];
      const allocations = allocationsRes.data || [];
      
      // Calculate metrics
      const activeProjects = projects.length;
      const activeResources = teamMembers.length;
      const totalRevenue = fees.reduce((sum, fee) => sum + (fee.fee || 0), 0);
      const avgProjectValue = activeProjects > 0 ? totalRevenue / activeProjects : 0;
      
      // Calculate utilization
      const totalHours = allocations.reduce((sum, alloc) => sum + (alloc.hours || 0), 0);
      const uniqueResources = new Set(allocations.map(alloc => alloc.resource_id)).size;
      const avgUtilization = uniqueResources > 0 ? Math.min((totalHours / (uniqueResources * workWeekHours)) * 100, 100) : 0;
      
      // Group by status
      const statusGroups = projects.reduce((acc, p) => {
        const status = p.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Group by stage
      const stageGroups = projects.reduce((acc, p) => {
        const stage = p.current_stage || 'Unknown';
        acc[stage] = (acc[stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Group by location
      const locationGroups = projects.reduce((acc, p) => {
        let locationKey = 'Unknown';
        if (p.temp_office_location_id && locations) {
          const loc = locations.find(l => l.id === p.temp_office_location_id);
          if (loc) locationKey = loc.country || loc.city || 'Unknown';
        } else if (p.country) {
          locationKey = p.country;
        }
        acc[locationKey] = (acc[locationKey] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Group by PM
      const pmGroups = projects.reduce((acc, p) => {
        let pmName = 'Unassigned';
        if (p.project_manager) {
          const pm = Array.isArray(p.project_manager) ? p.project_manager[0] : p.project_manager;
          pmName = `${pm.first_name || ''} ${pm.last_name || ''}`.trim() || 'Unknown';
        }
        acc[pmName] = (acc[pmName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const locationColors = ['#059669', '#0891B2', '#7C3AED', '#F59E0B', '#EF4444'];
      
      return {
        activeProjects,
        activeResources,
        totalRevenue,
        avgProjectValue,
        utilizationTrends: {
          days7: Math.round(avgUtilization),
          days30: Math.round(avgUtilization * 0.9),
          days90: Math.round(avgUtilization * 0.85)
        },
        projectsByStatus: Object.entries(statusGroups).map(([name, value]) => ({ name, value })),
        projectsByStage: Object.entries(stageGroups).map(([name, value]) => ({
          name,
          value,
          color: stages.find(s => s.name === name)?.color || '#E5DEFF'
        })),
        projectsByLocation: Object.entries(locationGroups).map(([name, value], index) => ({
          name,
          value,
          color: locationColors[index % locationColors.length]
        })),
        projectsByPM: Object.entries(pmGroups).map(([name, value]) => ({ name, value }))
      };
    },
    enabled: !!companyId || isDemoMode,
    staleTime: 2 * 60 * 1000,
  });
};
