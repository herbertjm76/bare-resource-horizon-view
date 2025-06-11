
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

export const useResourcePlanningData = (memberId: string) => {
  const { company } = useCompany();

  // Fetch member's profile data
  const { data: memberProfile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('weekly_capacity, first_name, last_name')
        .eq('id', memberId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Use a single combined query for planning data instead of multiple separate queries
  const { data: planningData, isLoading: isLoadingPlanningData, error: planningError } = useQuery({
    queryKey: ['resourcePlanningData', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id) return { futureAllocations: [], historicalData: [], activeProjects: [] };
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const twelveWeeksOut = addWeeks(currentWeekStart, 12);
      const eightWeeksAgo = subWeeks(currentWeekStart, 8);
      
      const startDateFuture = format(currentWeekStart, 'yyyy-MM-dd');
      const endDateFuture = format(twelveWeeksOut, 'yyyy-MM-dd');
      const startDateHistory = format(eightWeeksAgo, 'yyyy-MM-dd');
      const endDateHistory = format(currentWeekStart, 'yyyy-MM-dd');
      
      // Parallel fetching of all required data
      const [futureResponse, historicalResponse, projectsResponse] = await Promise.all([
        // Future allocations
        supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date, project:projects(id, name, status, contract_end_date)')
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id)
          .gte('week_start_date', startDateFuture)
          .lte('week_start_date', endDateFuture),
          
        // Historical data
        supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date')
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id)
          .gte('week_start_date', startDateHistory)
          .lt('week_start_date', endDateHistory),
          
        // Active projects
        supabase
          .from('project_resource_allocations')
          .select('project:projects(id, name, status, contract_end_date, current_stage)')
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id)
      ]);

      // Handle errors
      if (futureResponse.error) throw futureResponse.error;
      if (historicalResponse.error) throw historicalResponse.error;
      if (projectsResponse.error) throw projectsResponse.error;

      // Process active projects to get unique projects only
      const uniqueProjects = (projectsResponse.data || []).reduce((acc, allocation) => {
        const project = allocation.project;
        if (project && !acc.find(p => p.id === project.id)) {
          acc.push(project);
        }
        return acc;
      }, [] as any[]);

      return {
        futureAllocations: futureResponse.data || [],
        historicalData: historicalResponse.data || [],
        activeProjects: uniqueProjects
      };
    },
    enabled: !!memberId && !!company?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  return {
    memberProfile,
    futureAllocations: planningData?.futureAllocations || [],
    historicalData: planningData?.historicalData || [],
    activeProjects: planningData?.activeProjects || [],
    isLoading: isLoadingProfile || isLoadingPlanningData,
    hasError: !!profileError || !!planningError
  };
};
