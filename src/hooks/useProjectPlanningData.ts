import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useMemo } from 'react';

export interface ProjectPlanningProject {
  id: string;
  name: string;
  code: string;
  status: string;
  current_stage: string;
  stages: string[] | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
}

export interface OfficeStage {
  id: string;
  name: string;
  code: string | null;
  order_index: number;
}

export interface ProjectStageData {
  project_id: string;
  stage_name: string;
  contracted_weeks: number | null;
  total_budgeted_hours: number | null;
  total_budget_amount: number | null;
}

export interface TeamCompositionSummary {
  project_id: string;
  stage_id: string;
  total_hours: number;
  total_budget: number;
  headcount: number;
}

export const useProjectPlanningData = (statusFilter: string[] = ['Active']) => {
  const { company } = useCompany();

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects, refetch: refetchProjects } = useQuery({
    queryKey: ['planning-projects', company?.id, statusFilter],
    queryFn: async () => {
      if (!company?.id) return [];

      let query = supabase
        .from('projects')
        .select('id, name, code, status, current_stage, stages, contract_start_date, contract_end_date')
        .eq('company_id', company.id)
        .order('name');

      if (statusFilter.length > 0) {
        query = query.in('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectPlanningProject[];
    },
    enabled: !!company?.id
  });

  // Fetch office stages
  const { data: officeStages = [], isLoading: isLoadingStages } = useQuery({
    queryKey: ['office-stages', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];

      const { data, error } = await supabase
        .from('office_stages')
        .select('id, name, code, order_index')
        .eq('company_id', company.id)
        .order('order_index');

      if (error) throw error;
      return data as OfficeStage[];
    },
    enabled: !!company?.id
  });

  // Fetch project stages data (contracted weeks, etc.)
  const projectIds = projects.map(p => p.id);
  const { data: projectStagesData = [], isLoading: isLoadingProjectStages, refetch: refetchProjectStages } = useQuery({
    queryKey: ['project-stages-data', projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];

      const { data, error } = await supabase
        .from('project_stages')
        .select('project_id, stage_name, contracted_weeks, total_budgeted_hours, total_budget_amount')
        .in('project_id', projectIds);

      if (error) throw error;
      return data as ProjectStageData[];
    },
    enabled: projectIds.length > 0
  });

  // Fetch team composition summaries
  const { data: compositionData = [], isLoading: isLoadingComposition, refetch: refetchComposition } = useQuery({
    queryKey: ['team-composition-summary', projectIds],
    queryFn: async () => {
      if (projectIds.length === 0) return [];

      const { data, error } = await supabase
        .from('project_stage_team_composition')
        .select('project_id, stage_id, total_planned_hours, total_budget_amount, planned_quantity')
        .in('project_id', projectIds);

      if (error) throw error;

      // Aggregate by project and stage
      const aggregated: Record<string, TeamCompositionSummary> = {};
      data?.forEach(item => {
        const key = `${item.project_id}:${item.stage_id}`;
        if (!aggregated[key]) {
          aggregated[key] = {
            project_id: item.project_id,
            stage_id: item.stage_id,
            total_hours: 0,
            total_budget: 0,
            headcount: 0
          };
        }
        aggregated[key].total_hours += item.total_planned_hours || 0;
        aggregated[key].total_budget += item.total_budget_amount || 0;
        aggregated[key].headcount += item.planned_quantity || 0;
      });

      return Object.values(aggregated);
    },
    enabled: projectIds.length > 0
  });

  // Calculate totals
  const totals = useMemo(() => {
    const totalProjectedHours = compositionData.reduce((sum, c) => sum + c.total_hours, 0);
    const totalBudget = compositionData.reduce((sum, c) => sum + c.total_budget, 0);
    const totalHeadcount = compositionData.reduce((sum, c) => sum + c.headcount, 0);

    return {
      totalProjectedHours,
      totalBudget,
      totalHeadcount,
      projectCount: projects.length
    };
  }, [compositionData, projects]);

  const isLoading = isLoadingProjects || isLoadingStages || isLoadingProjectStages || isLoadingComposition;

  const refetch = () => {
    refetchProjects();
    refetchProjectStages();
    refetchComposition();
  };

  return {
    projects,
    officeStages,
    projectStagesData,
    compositionData,
    totals,
    isLoading,
    refetch
  };
};
