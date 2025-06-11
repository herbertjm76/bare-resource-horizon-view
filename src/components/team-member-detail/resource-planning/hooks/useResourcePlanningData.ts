
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

export const useResourcePlanningData = (memberId: string) => {
  const { company } = useCompany();

  console.log('🔍 RESOURCE PLANNING: Loading for member:', memberId, 'company:', company?.id);

  // Fetch member's profile data
  const { data: memberProfile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async () => {
      console.log('🔍 RESOURCE PLANNING: Fetching member profile for:', memberId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('weekly_capacity, first_name, last_name')
        .eq('id', memberId)
        .maybeSingle();
      
      if (error) {
        console.error('🔍 RESOURCE PLANNING: Profile fetch error:', error);
        throw error;
      }
      
      console.log('🔍 RESOURCE PLANNING: Profile data:', data);
      return data;
    },
    enabled: !!memberId,
  });

  // Fetch next 12 weeks of allocations for planning
  const { data: futureAllocations, isLoading: isLoadingFuture, error: futureError } = useQuery({
    queryKey: ['futureAllocations', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id) {
        console.log('🔍 RESOURCE PLANNING: No company ID available');
        return [];
      }
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const twelveWeeksOut = addWeeks(currentWeekStart, 12);
      const startDate = format(currentWeekStart, 'yyyy-MM-dd');
      const endDate = format(twelveWeeksOut, 'yyyy-MM-dd');
      
      console.log('🔍 RESOURCE PLANNING: Fetching future allocations from', startDate, 'to', endDate);
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          hours,
          week_start_date,
          project:projects(id, name, status, contract_end_date)
        `)
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .gte('week_start_date', startDate)
        .lte('week_start_date', endDate);
      
      if (error) {
        console.error('🔍 RESOURCE PLANNING: Future allocations error:', error);
        throw error;
      }
      
      console.log('🔍 RESOURCE PLANNING: Future allocations data:', data);
      return data || [];
    },
    enabled: !!memberId && !!company?.id,
  });

  // Fetch historical utilization for trends
  const { data: historicalData, isLoading: isLoadingHistorical, error: historicalError } = useQuery({
    queryKey: ['historicalUtilization', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const eightWeeksAgo = subWeeks(currentWeekStart, 8);
      const startDate = format(eightWeeksAgo, 'yyyy-MM-dd');
      const endDate = format(currentWeekStart, 'yyyy-MM-dd');
      
      console.log('🔍 RESOURCE PLANNING: Fetching historical data from', startDate, 'to', endDate);
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('hours, week_start_date')
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .gte('week_start_date', startDate)
        .lt('week_start_date', endDate);
      
      if (error) {
        console.error('🔍 RESOURCE PLANNING: Historical data error:', error);
        throw error;
      }
      
      console.log('🔍 RESOURCE PLANNING: Historical data:', data);
      return data || [];
    },
    enabled: !!memberId && !!company?.id,
  });

  // Fetch active projects
  const { data: activeProjects, isLoading: isLoadingProjects, error: projectsError } = useQuery({
    queryKey: ['memberActiveProjects', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      console.log('🔍 RESOURCE PLANNING: Fetching active projects');
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          project:projects(
            id,
            name,
            status,
            contract_end_date,
            current_stage
          )
        `)
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id);
      
      if (error) {
        console.error('🔍 RESOURCE PLANNING: Active projects error:', error);
        throw error;
      }
      
      // Get unique projects
      const uniqueProjects = data?.reduce((acc, allocation) => {
        const project = allocation.project;
        if (project && !acc.find(p => p.id === project.id)) {
          acc.push(project);
        }
        return acc;
      }, [] as any[]) || [];
      
      console.log('🔍 RESOURCE PLANNING: Active projects data:', uniqueProjects);
      return uniqueProjects;
    },
    enabled: !!memberId && !!company?.id,
  });

  return {
    memberProfile,
    futureAllocations,
    historicalData,
    activeProjects,
    isLoading: isLoadingProfile || isLoadingFuture || isLoadingHistorical || isLoadingProjects,
    hasError: profileError || futureError || historicalError || projectsError
  };
};
