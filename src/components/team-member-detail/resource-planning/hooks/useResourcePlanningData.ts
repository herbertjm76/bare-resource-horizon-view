
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, startOfWeek, addWeeks, subWeeks } from 'date-fns';

export const useResourcePlanningData = (memberId: string) => {
  const { company } = useCompany();

  // Fetch member's profile data with timeout protection
  const { data: memberProfile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['memberProfile', memberId],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('weekly_capacity, first_name, last_name')
          .eq('id', memberId)
          .abortSignal(controller.signal)
          .maybeSingle();
        
        clearTimeout(timeoutId);
        if (error) throw error;
        return data;
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!memberId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  // Fetch active projects with timeout protection
  const { data: activeProjects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['resourceActiveProjects', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id || !memberId) return [];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        // RULEBOOK: ALL allocation reads include both active and pre_registered
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select('project:projects(id, name, status, contract_end_date, current_stage)')
          .eq('resource_id', memberId)
          .in('resource_type', ['active', 'pre_registered'])
          .eq('company_id', company.id)
          .not('hours', 'is', null)
          .abortSignal(controller.signal)
          .limit(5);
          
        clearTimeout(timeoutId);
        if (error) throw error;
        
        return (data || []).reduce((acc, allocation) => {
          const project = allocation.project;
          if (project && !acc.find((p: any) => p.id === project.id)) {
            acc.push(project);
          }
          return acc;
        }, [] as any[]);
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!memberId && !!company?.id,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  // Simplified allocation data fetch with timeout protection
  const { data: allocationData, isLoading: isLoadingAllocationData } = useQuery({
    queryKey: ['resourceAllocationData', memberId, company?.id],
    queryFn: async () => {
      if (!company?.id || !memberId) return { futureAllocations: [], historicalData: [] };
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
        const fourWeeksOut = addWeeks(currentWeekStart, 4);
        const twoWeeksAgo = subWeeks(currentWeekStart, 2);
        
        const startDateFuture = format(currentWeekStart, 'yyyy-MM-dd');
        const endDateFuture = format(fourWeeksOut, 'yyyy-MM-dd');
        const startDateHistory = format(twoWeeksAgo, 'yyyy-MM-dd');
        const endDateHistory = format(currentWeekStart, 'yyyy-MM-dd');
        
        // RULEBOOK: ALL allocation reads include both active and pre_registered
        const [futureResponse, historicalResponse] = await Promise.all([
          supabase
            .from('project_resource_allocations')
            .select('hours, allocation_date, project:projects!inner(id, name)')
            .eq('resource_id', memberId)
            .in('resource_type', ['active', 'pre_registered'])
            .eq('company_id', company.id)
            .gte('allocation_date', startDateFuture)
            .lte('allocation_date', endDateFuture)
            .abortSignal(controller.signal)
            .limit(20),
            
          supabase
            .from('project_resource_allocations')
            .select('hours, allocation_date')
            .eq('resource_id', memberId)
            .in('resource_type', ['active', 'pre_registered'])
            .eq('company_id', company.id)
            .gte('allocation_date', startDateHistory)
            .lt('allocation_date', endDateHistory)
            .abortSignal(controller.signal)
            .limit(10),
        ]);

        clearTimeout(timeoutId);

        if (futureResponse.error) throw futureResponse.error;
        if (historicalResponse.error) throw historicalResponse.error;

        return {
          futureAllocations: futureResponse.data || [],
          historicalData: historicalResponse.data || [],
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    enabled: !!memberId && !!company?.id,
    staleTime: 3 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
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
