
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

export const useResourcePlanningData = (memberId: string) => {
  const { company } = useCompany();

  // Fetch member's profile data with optimized staleTime
  const { data: memberProfile, isLoading: isLoadingProfile } = useQuery({
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
    staleTime: 10 * 60 * 1000, // 10 minutes cache
    retry: 1, // Reduce retry attempts
    gcTime: 15 * 60 * 1000, // Garbage collection time
  });

  // Use a separate query for active projects with minimal data needed
  const { data: activeProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['resourceActiveProjects', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id || !memberId) return [];
      
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select('project:projects(id, name, status, contract_end_date, current_stage)')
        .eq('resource_id', memberId)
        .eq('resource_type', 'active')
        .eq('company_id', company.id)
        .not('hours', 'is', null); // Fixed TypeScript error
        
      if (error) throw error;
      
      // Process active projects to get unique projects only
      return (data || []).reduce((acc, allocation) => {
        const project = allocation.project;
        if (project && !acc.find((p: any) => p.id === project.id)) {
          acc.push(project);
        }
        return acc;
      }, [] as any[]);
    },
    enabled: !!memberId && !!company?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Only fetch allocation data when needed for the detailed view
  const { data: allocationData, isLoading: isLoadingAllocationData } = useQuery({
    queryKey: ['resourceAllocationData', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id || !memberId) return { futureAllocations: [], historicalData: [] };
      
      const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const eightWeeksOut = addWeeks(currentWeekStart, 8); // Reduced from 12 to 8 weeks for faster loading
      const fourWeeksAgo = subWeeks(currentWeekStart, 4); // Reduced from 8 to 4 weeks for faster loading
      
      const startDateFuture = format(currentWeekStart, 'yyyy-MM-dd');
      const endDateFuture = format(eightWeeksOut, 'yyyy-MM-dd');
      const startDateHistory = format(fourWeeksAgo, 'yyyy-MM-dd');
      const endDateHistory = format(currentWeekStart, 'yyyy-MM-dd');
      
      // Parallel fetching of all required data
      const [futureResponse, historicalResponse] = await Promise.all([
        // Future allocations - optimized query
        supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date, project:projects(id, name)')
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id)
          .gte('week_start_date', startDateFuture)
          .lte('week_start_date', endDateFuture),
          
        // Historical data - optimized query
        supabase
          .from('project_resource_allocations')
          .select('hours, week_start_date')
          .eq('resource_id', memberId)
          .eq('resource_type', 'active')
          .eq('company_id', company.id)
          .gte('week_start_date', startDateHistory)
          .lt('week_start_date', endDateHistory),
      ]);

      // Handle errors
      if (futureResponse.error) throw futureResponse.error;
      if (historicalResponse.error) throw historicalResponse.error;

      return {
        futureAllocations: futureResponse.data || [],
        historicalData: historicalResponse.data || [],
      };
    },
    enabled: !!memberId && !!company?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  return {
    memberProfile,
    futureAllocations: allocationData?.futureAllocations || [],
    historicalData: allocationData?.historicalData || [],
    activeProjects,
    isLoading: isLoadingProfile || isLoadingProjects || isLoadingAllocationData,
    isLoadingProjects,
    isLoadingAllocationData,
    hasError: false
  };
};
