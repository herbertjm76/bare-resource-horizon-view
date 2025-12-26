import React, { useMemo } from 'react';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { cn } from '@/lib/utils';
import { Loader2, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Project {
  id: string;
  name: string;
  code: string;
  current_stage: string;
  status: string;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  stages?: string[] | null;
}

interface EnhancedTimelineViewProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectClick?: (project: Project) => void;
}

interface StageData {
  name: string;
  color: string;
  contractedWeeks?: number;
  orderIndex: number;
}

export const EnhancedTimelineView: React.FC<EnhancedTimelineViewProps> = ({
  projects,
  isLoading,
  onProjectClick,
}) => {
  const { company } = useCompany();
  const { data: officeStages } = useOfficeStages();

  // Fetch project_stages for contracted weeks
  const { data: projectStagesData } = useQuery({
    queryKey: ['project-stages-all', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('project_stages')
        .select('project_id, stage_name, contracted_weeks, is_applicable')
        .eq('company_id', company.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id
  });

  // Build stage info map (name -> color, order)
  const stageInfoMap = useMemo(() => {
    const map: Record<string, { color: string; orderIndex: number }> = {};
    officeStages?.forEach(s => {
      map[s.name] = { color: s.color || '#3b82f6', orderIndex: s.order_index };
    });
    return map;
  }, [officeStages]);

  // Build project stages map (projectId -> { stageName: contractedWeeks })
  const projectStagesMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    projectStagesData?.forEach(ps => {
      if (!map[ps.project_id]) {
        map[ps.project_id] = {};
      }
      if (ps.contracted_weeks) {
        map[ps.project_id][ps.stage_name] = ps.contracted_weeks;
      }
    });
    return map;
  }, [projectStagesData]);

  // Get ordered stages for a project
  const getProjectStages = (project: Project): StageData[] => {
    if (!project.stages || project.stages.length === 0) {
      // If no stages defined, show current stage only
      if (project.current_stage) {
        const info = stageInfoMap[project.current_stage] || { color: '#6b7280', orderIndex: 0 };
        return [{
          name: project.current_stage,
          color: info.color,
          orderIndex: info.orderIndex,
          contractedWeeks: projectStagesMap[project.id]?.[project.current_stage]
        }];
      }
      return [];
    }

    // Sort stages by their order_index
    return project.stages.map(stageName => {
      const info = stageInfoMap[stageName] || { color: '#6b7280', orderIndex: 999 };
      return {
        name: stageName,
        color: info.color,
        orderIndex: info.orderIndex,
        contractedWeeks: projectStagesMap[project.id]?.[stageName]
      };
    }).sort((a, b) => a.orderIndex - b.orderIndex);
  };

  // Check if a stage is the current stage
  const isCurrentStage = (project: Project, stageName: string): boolean => {
    // current_stage might be the stage name or ID
    if (project.current_stage === stageName) return true;
    
    // Check if current_stage is an ID that matches this stage
    const stage = officeStages?.find(s => s.id === project.current_stage);
    return stage?.name === stageName;
  };

  // Calculate the completed stage index
  const getCurrentStageIndex = (project: Project, stages: StageData[]): number => {
    for (let i = 0; i < stages.length; i++) {
      if (isCurrentStage(project, stages[i].name)) {
        return i;
      }
    }
    return -1;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        No projects found
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-1">
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2 text-xs font-medium text-muted-foreground border-b border-border">
          <div className="col-span-3">Project</div>
          <div className="col-span-9">Stage Progression</div>
        </div>

        {/* Project rows */}
        {projects.map(project => {
          const stages = getProjectStages(project);
          const currentIndex = getCurrentStageIndex(project, stages);
          const totalWeeks = stages.reduce((sum, s) => sum + (s.contractedWeeks || 1), 0);

          return (
            <div
              key={project.id}
              className="grid grid-cols-12 gap-3 px-4 py-3 hover:bg-muted/30 cursor-pointer transition-colors rounded-lg group"
              onClick={() => onProjectClick?.(project)}
            >
              {/* Project info */}
              <div className="col-span-3">
                <div className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                  {project.name}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {project.code}
                </div>
              </div>

              {/* Stage progression bar */}
              <div className="col-span-9 flex items-center">
                {stages.length === 0 ? (
                  <div className="text-xs text-muted-foreground italic">
                    No stages configured
                  </div>
                ) : (
                  <div className="flex items-center w-full h-8 rounded-lg overflow-hidden bg-muted/30">
                    {stages.map((stage, idx) => {
                      const isActive = idx === currentIndex;
                      const isCompleted = currentIndex >= 0 && idx < currentIndex;
                      const widthPercent = (stage.contractedWeeks || 1) / totalWeeks * 100;

                      return (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "h-full flex items-center justify-center relative transition-all",
                                "border-r border-background/30 last:border-r-0",
                                isActive && "ring-2 ring-primary ring-inset shadow-lg z-10",
                                !isActive && !isCompleted && "opacity-40"
                              )}
                              style={{
                                width: `${widthPercent}%`,
                                backgroundColor: stage.color,
                                minWidth: '40px'
                              }}
                            >
                              <span className={cn(
                                "text-[10px] font-semibold truncate px-1",
                                isActive ? "text-white" : "text-white/80"
                              )}>
                                {stage.name}
                              </span>
                              
                              {/* Active indicator */}
                              {isActive && (
                                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                </div>
                              )}
                              
                              {/* Completed checkmark */}
                              {isCompleted && (
                                <div className="absolute top-0.5 right-0.5">
                                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                                    <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            <div className="font-medium">{stage.name}</div>
                            {stage.contractedWeeks && (
                              <div className="text-muted-foreground">
                                {stage.contractedWeeks} weeks
                              </div>
                            )}
                            {isActive && (
                              <div className="text-primary font-medium">Current Stage</div>
                            )}
                            {isCompleted && (
                              <div className="text-green-500 font-medium">Completed</div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};
