import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { startOfWeek, addWeeks, format } from 'date-fns';

export interface ProjectDemand {
  projectId: string;
  projectName: string;
  projectCode: string;
  stageId: string;
  stageName: string;
  roleId?: string;
  roleName?: string;
  memberId?: string;
  memberName?: string;
  weeklyHours: number;
  contractedWeeks: number;
  startDate: Date;
}

export interface WeeklyDemandData {
  weekKey: string;
  weekDate: Date;
  demandByRole: Record<string, number>;
  demandByProject: Record<string, number>;
  totalDemand: number;
}

export interface DemandProjectionResult {
  weeklyDemand: WeeklyDemandData[];
  projectDemands: ProjectDemand[];
  roleNames: Record<string, string>;
  totalProjectedHours: number;
  isLoading: boolean;
  error: Error | null;
}

export const useDemandProjection = (startDate: Date, numberOfWeeks: number = 12): DemandProjectionResult => {
  const { companyId, isReady, isLoading: companyLoading } = useCompanyId();

  const { data, isLoading, error } = useQuery({
    queryKey: ['demand-projection', companyId, startDate.toISOString(), numberOfWeeks],
    queryFn: async () => {
      if (!companyId) return null;

      // Fetch all projects with their stages and team compositions
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          code,
          contract_start_date,
          contract_end_date,
          status
        `)
        .eq('company_id', companyId)
        .in('status', ['Active', 'In Progress', 'Confirmed', 'Pre-Award', 'Pre-Contract']);

      if (projectsError) throw projectsError;

      // Get stages with contracted weeks
      const { data: stages, error: stagesError } = await supabase
        .from('project_stages')
        .select('id, project_id, stage_name, contracted_weeks, total_budgeted_hours')
        .in('project_id', projects?.map(p => p.id) || []);

      if (stagesError) throw stagesError;

      // Get team compositions
      const stageIds = stages?.map(s => s.id) || [];
      const { data: compositions, error: compositionsError } = await supabase
        .from('project_stage_team_composition')
        .select('*')
        .in('stage_id', stageIds);

      if (compositionsError) throw compositionsError;

      // Fetch role names
      const roleIds = [...new Set(compositions?.filter(c => c.reference_type === 'role').map(c => c.reference_id) || [])];
      let roleNames: Record<string, string> = {};
      
      if (roleIds.length > 0) {
        const { data: roles } = await supabase
          .from('office_roles')
          .select('id, name, code')
          .in('id', roleIds);
        
        roleNames = Object.fromEntries((roles || []).map(r => [r.id, r.code || r.name]));
      }

      // Fetch member names
      const memberIds = [...new Set(compositions?.filter(c => c.reference_type === 'member').map(c => c.reference_id) || [])];
      let memberNames: Record<string, string> = {};
      
      if (memberIds.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', memberIds);
        
        memberNames = Object.fromEntries((profiles || []).map(p => [
          p.id, 
          `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Unknown'
        ]));
      }

      return { projects, stages, compositions, roleNames, memberNames };
    },
    enabled: isReady,
  });

  // Process data into weekly demand
  const processedData = (() => {
    if (!data) {
      return {
        weeklyDemand: [] as WeeklyDemandData[],
        projectDemands: [] as ProjectDemand[],
        roleNames: {} as Record<string, string>,
        totalProjectedHours: 0,
      };
    }

    const { projects, stages, compositions, roleNames, memberNames } = data;
    const projectDemands: ProjectDemand[] = [];
    const weeklyDemand: WeeklyDemandData[] = [];

    // Initialize weeks
    for (let i = 0; i < numberOfWeeks; i++) {
      const weekDate = addWeeks(startOfWeek(startDate, { weekStartsOn: 1 }), i);
      weeklyDemand.push({
        weekKey: format(weekDate, 'yyyy-MM-dd'),
        weekDate,
        demandByRole: {},
        demandByProject: {},
        totalDemand: 0,
      });
    }

    // Process each project's stages and compositions
    projects?.forEach(project => {
      const projectStages = stages?.filter(s => s.project_id === project.id) || [];
      
      // Calculate weekly hours from team compositions
      projectStages.forEach(stage => {
        const stageCompositions = compositions?.filter(c => c.stage_id === stage.id) || [];
        const contractedWeeks = stage.contracted_weeks || 4; // Default to 4 weeks if not set
        
        stageCompositions.forEach(comp => {
          const weeklyHours = comp.total_planned_hours / Math.max(contractedWeeks, 1);
          
          const demand: ProjectDemand = {
            projectId: project.id,
            projectName: project.name,
            projectCode: project.code,
            stageId: stage.id,
            stageName: stage.stage_name,
            weeklyHours,
            contractedWeeks,
            startDate: project.contract_start_date ? new Date(project.contract_start_date) : new Date(),
          };

          if (comp.reference_type === 'role') {
            demand.roleId = comp.reference_id;
            demand.roleName = roleNames[comp.reference_id] || 'Unknown Role';
          } else {
            demand.memberId = comp.reference_id;
            demand.memberName = memberNames[comp.reference_id] || 'Unknown Member';
          }

          projectDemands.push(demand);

          // Distribute demand across weeks based on project timeline
          const projectStart = project.contract_start_date 
            ? new Date(project.contract_start_date) 
            : startDate;
          
          weeklyDemand.forEach((week, weekIndex) => {
            const weekStartMs = week.weekDate.getTime();
            const projectStartMs = projectStart.getTime();
            const projectEndMs = project.contract_end_date 
              ? new Date(project.contract_end_date).getTime()
              : addWeeks(projectStart, contractedWeeks).getTime();

            // Check if this week falls within the project timeline
            if (weekStartMs >= projectStartMs && weekStartMs <= projectEndMs) {
              // Add to role demand
              if (demand.roleId) {
                week.demandByRole[demand.roleId] = (week.demandByRole[demand.roleId] || 0) + weeklyHours;
              }
              
              // Add to project demand
              week.demandByProject[project.id] = (week.demandByProject[project.id] || 0) + weeklyHours;
              
              // Add to total
              week.totalDemand += weeklyHours;
            }
          });
        });
      });
    });

    const totalProjectedHours = weeklyDemand.reduce((sum, week) => sum + week.totalDemand, 0);

    return { weeklyDemand, projectDemands, roleNames, totalProjectedHours };
  })();

  return {
    ...processedData,
    // Return true when company loading, not ready, or query loading
    isLoading: companyLoading || !isReady || isLoading,
    error: error as Error | null,
  };
};
