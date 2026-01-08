import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { useMemo } from 'react';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_PROJECTS, DEMO_STAGES, DEMO_DEPARTMENTS } from '@/data/demoData';

export interface ProjectPlanningProject {
  id: string;
  name: string;
  code: string;
  status: string;
  current_stage: string;
  stages: string[] | null;
  contract_start_date: string | null;
  contract_end_date: string | null;
  department: string | null;
}

export interface OfficeStage {
  id: string;
  name: string;
  code: string | null;
  order_index: number;
}

export interface ProjectStageData {
  id: string;
  project_id: string;
  stage_name: string;
  contracted_weeks: number | null;
  total_budgeted_hours: number | null;
  total_budget_amount: number | null;
  start_date: string | null;
}

export interface TeamCompositionSummary {
  project_id: string;
  stage_id: string;
  total_hours: number;
  total_budget: number;
  headcount: number;
}

// Generate demo project stages
const generateDemoProjectStages = (): ProjectStageData[] => {
  const stages: ProjectStageData[] = [];
  
  DEMO_PROJECTS.forEach(project => {
    DEMO_STAGES.forEach((stage, idx) => {
      stages.push({
        id: `demo-ps-${project.id}-${stage.id}`,
        project_id: project.id,
        stage_name: stage.name,
        contracted_weeks: 4 + idx * 2,
        total_budgeted_hours: Math.floor(project.budget_hours / 5),
        total_budget_amount: Math.floor(project.budget_amount / 5),
        start_date: project.contract_start_date
      });
    });
  });
  
  return stages;
};

// Generate demo team composition summaries
const generateDemoCompositionData = (): TeamCompositionSummary[] => {
  const compositions: TeamCompositionSummary[] = [];
  
  DEMO_PROJECTS.forEach(project => {
    DEMO_STAGES.forEach(stage => {
      compositions.push({
        project_id: project.id,
        stage_id: stage.id,
        total_hours: Math.floor(project.budget_hours / 5),
        total_budget: Math.floor(project.budget_amount / 5),
        headcount: 2 + Math.floor(Math.random() * 3)
      });
    });
  });
  
  return compositions;
};

export const useProjectPlanningData = (statusFilter: string[] = ['Active']) => {
  const { companyId, isReady, isLoading: companyLoading } = useCompanyId();
  const { isDemoMode } = useDemoAuth();

  // Fetch projects
  const { data: projects = [], isLoading: isLoadingProjects, refetch: refetchProjects } = useQuery({
    queryKey: ['planning-projects', companyId, statusFilter, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        const demoProjects = DEMO_PROJECTS.filter(p => 
          statusFilter.length === 0 || statusFilter.includes(p.status)
        ).map(p => ({
          id: p.id,
          name: p.name,
          code: p.code,
          status: p.status,
          current_stage: p.current_stage,
          stages: p.stages,
          contract_start_date: p.contract_start_date,
          contract_end_date: p.contract_end_date,
          department: p.department
        }));
        return demoProjects as ProjectPlanningProject[];
      }
      
      if (!companyId) return [];

      let query = supabase
        .from('projects')
        .select('id, name, code, status, current_stage, stages, contract_start_date, contract_end_date, department')
        .eq('company_id', companyId)
        .order('name');

      if (statusFilter.length > 0) {
        query = query.in('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProjectPlanningProject[];
    },
    enabled: isReady || isDemoMode
  });

  // Fetch office stages
  const { data: officeStages = [], isLoading: isLoadingStages } = useQuery({
    queryKey: ['office-stages', companyId, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        return DEMO_STAGES.map(s => ({
          id: s.id,
          name: s.name,
          code: s.code,
          order_index: s.order_index
        })) as OfficeStage[];
      }
      
      if (!companyId) return [];

      const { data, error } = await supabase
        .from('office_stages')
        .select('id, name, code, order_index')
        .eq('company_id', companyId)
        .order('order_index');

      if (error) throw error;
      return data as OfficeStage[];
    },
    enabled: isReady || isDemoMode
  });

  // Fetch project stages data (contracted weeks, etc.)
  const projectIds = projects.map(p => p.id);
  const { data: projectStagesData = [], isLoading: isLoadingProjectStages, refetch: refetchProjectStages } = useQuery({
    queryKey: ['project-stages-data', projectIds, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        const allDemoStages = generateDemoProjectStages();
        return allDemoStages.filter(s => projectIds.includes(s.project_id));
      }
      
      if (projectIds.length === 0) return [];

      const { data, error } = await supabase
        .from('project_stages')
        .select('id, project_id, stage_name, contracted_weeks, total_budgeted_hours, total_budget_amount, start_date')
        .in('project_id', projectIds);

      if (error) throw error;
      return data as ProjectStageData[];
    },
    enabled: projectIds.length > 0 || isDemoMode
  });

  // Fetch team composition summaries
  const { data: compositionData = [], isLoading: isLoadingComposition, refetch: refetchComposition } = useQuery({
    queryKey: ['team-composition-summary', projectIds, isDemoMode],
    queryFn: async () => {
      // Return demo data in demo mode
      if (isDemoMode) {
        const allCompositions = generateDemoCompositionData();
        return allCompositions.filter(c => projectIds.includes(c.project_id));
      }
      
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
    enabled: projectIds.length > 0 || isDemoMode
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

  // Return true when company loading, not ready, or any query loading
  const isLoading = isDemoMode ? false : (companyLoading || !isReady || isLoadingProjects || isLoadingStages || isLoadingProjectStages || isLoadingComposition);

  const refetch = () => {
    if (!isDemoMode) {
      refetchProjects();
      refetchProjectStages();
      refetchComposition();
    }
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
