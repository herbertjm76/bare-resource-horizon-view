import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useUserProjects = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user-projects', userId],
    queryFn: async () => {
      if (!userId) return { current: [], history: [] };

      // RULEBOOK: Intentionally fetches both 'active' and 'pre_registered' allocations
      // because this shows ALL projects a user has been allocated to (profile view)
      const { data: allocations, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          project_id,
          hours,
          allocation_date,
          projects (
            id,
            name,
            status,
            contract_end_date,
            current_stage
          )
        `)
        .eq('resource_id', userId)
        .in('resource_type', ['active', 'pre_registered'])
        .order('allocation_date', { ascending: false });

      if (error) throw error;

      // Group by project and calculate totals
      const projectMap = new Map();
      
      allocations?.forEach((allocation: any) => {
        const project = allocation.projects;
        if (!project) return;
        
        const projectId = project.id;
        if (!projectMap.has(projectId)) {
          projectMap.set(projectId, {
            id: project.id,
            name: project.name,
            status: project.status,
            contract_end_date: project.contract_end_date,
            current_stage: project.current_stage,
            total_hours: 0,
            latest_week: allocation.allocation_date
          });
        }
        
        const projectData = projectMap.get(projectId);
        projectData.total_hours += Number(allocation.hours);
      });

      const allProjects = Array.from(projectMap.values());

      // Split into current (active/in progress) and history (completed only)
      const current = allProjects.filter(p => 
        p.status === 'In Progress' || p.status === 'Planning' || p.status === 'On Hold'
      );
      
      const history = allProjects.filter(p => 
        p.status === 'Complete'
      );

      return { current, history };
    },
    enabled: !!userId
  });
};
