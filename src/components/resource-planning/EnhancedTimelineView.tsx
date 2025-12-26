import React, { useMemo } from 'react';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, startOfWeek, addWeeks, isWithinInterval, parseISO, differenceInWeeks } from 'date-fns';

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
  contractedWeeks: number;
  orderIndex: number;
  startWeekOffset: number; // weeks from project start
}

const WEEKS_TO_SHOW = 16; // Show 16 weeks (about 4 months)

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

  // Generate week columns starting from today
  const weeks = useMemo(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 });
    
    return Array.from({ length: WEEKS_TO_SHOW }, (_, i) => {
      const date = addWeeks(weekStart, i - 1); // Start 1 week before current
      return {
        date,
        label: format(date, 'MMM d'),
        weekNumber: format(date, 'w'),
        isCurrentWeek: i === 1,
        month: format(date, 'MMM'),
        isNewMonth: i === 0 || format(addWeeks(weekStart, i - 2), 'MMM') !== format(date, 'MMM')
      };
    });
  }, []);

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

  // Get ordered stages with week offsets for a project
  const getProjectStagesWithOffsets = (project: Project): StageData[] => {
    const stages: StageData[] = [];
    
    if (!project.stages || project.stages.length === 0) {
      if (project.current_stage) {
        const info = stageInfoMap[project.current_stage] || { color: '#6b7280', orderIndex: 0 };
        stages.push({
          name: project.current_stage,
          color: info.color,
          orderIndex: info.orderIndex,
          contractedWeeks: projectStagesMap[project.id]?.[project.current_stage] || 4,
          startWeekOffset: 0
        });
      }
      return stages;
    }

    // Sort stages by their order_index
    const sortedStages = [...project.stages]
      .map(stageName => {
        const info = stageInfoMap[stageName] || { color: '#6b7280', orderIndex: 999 };
        return {
          name: stageName,
          color: info.color,
          orderIndex: info.orderIndex,
          contractedWeeks: projectStagesMap[project.id]?.[stageName] || 2
        };
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);

    // Calculate week offsets
    let weekOffset = 0;
    sortedStages.forEach(stage => {
      stages.push({
        ...stage,
        startWeekOffset: weekOffset
      });
      weekOffset += stage.contractedWeeks;
    });

    return stages;
  };

  // Get project start week index relative to our weeks array
  const getProjectStartWeekIndex = (project: Project): number => {
    if (!project.contract_start_date) {
      return 1; // Default to current week if no start date
    }
    
    const projectStart = parseISO(project.contract_start_date);
    const firstWeek = weeks[0].date;
    const diffWeeks = differenceInWeeks(projectStart, firstWeek);
    
    return Math.max(0, Math.min(diffWeeks, WEEKS_TO_SHOW - 1));
  };

  // Check if a stage is the current stage
  const isCurrentStage = (project: Project, stageName: string): boolean => {
    if (project.current_stage === stageName) return true;
    const stage = officeStages?.find(s => s.id === project.current_stage);
    return stage?.name === stageName;
  };

  // Get current stage index
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
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1000px]">
          <thead>
            {/* Month row */}
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-background p-2 text-left text-xs font-medium text-muted-foreground w-48 min-w-48">
                Project
              </th>
              {weeks.map((week, i) => (
                <th
                  key={i}
                  className={cn(
                    "p-1 text-center text-[10px] font-medium text-muted-foreground border-l border-border/50",
                    week.isCurrentWeek && "bg-primary/10"
                  )}
                  style={{ width: `${100 / WEEKS_TO_SHOW}%`, minWidth: '50px' }}
                >
                  {week.isNewMonth && (
                    <div className="font-semibold text-foreground">{week.month}</div>
                  )}
                </th>
              ))}
            </tr>
            {/* Week labels row */}
            <tr className="border-b border-border">
              <th className="sticky left-0 z-10 bg-background p-2"></th>
              {weeks.map((week, i) => (
                <th
                  key={i}
                  className={cn(
                    "p-1 text-center text-[10px] font-normal text-muted-foreground border-l border-border/50",
                    week.isCurrentWeek && "bg-primary/10 font-semibold text-primary"
                  )}
                >
                  {week.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {projects.map(project => {
              const stages = getProjectStagesWithOffsets(project);
              const projectStartIndex = getProjectStartWeekIndex(project);
              const currentStageIndex = getCurrentStageIndex(project, stages);

              return (
                <tr
                  key={project.id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer group"
                  onClick={() => onProjectClick?.(project)}
                >
                  {/* Project name cell */}
                  <td className="sticky left-0 z-10 bg-background group-hover:bg-muted/30 p-2 w-48 min-w-48 transition-colors">
                    <div className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                      {project.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {project.code}
                    </div>
                  </td>

                  {/* Week cells */}
                  {weeks.map((week, weekIndex) => {
                    // Find which stage (if any) occupies this week
                    const stageForWeek = stages.find(stage => {
                      const stageStart = projectStartIndex + stage.startWeekOffset;
                      const stageEnd = stageStart + stage.contractedWeeks;
                      return weekIndex >= stageStart && weekIndex < stageEnd;
                    });

                    if (!stageForWeek) {
                      return (
                        <td
                          key={weekIndex}
                          className={cn(
                            "p-0 border-l border-border/30 h-12",
                            week.isCurrentWeek && "bg-primary/5"
                          )}
                        />
                      );
                    }

                    // Calculate position within the stage
                    const stageStart = projectStartIndex + stageForWeek.startWeekOffset;
                    const stageEnd = stageStart + stageForWeek.contractedWeeks;
                    const isFirst = weekIndex === stageStart;
                    const isLast = weekIndex === stageEnd - 1;
                    const stageIdx = stages.findIndex(s => s.name === stageForWeek.name);
                    const isActive = stageIdx === currentStageIndex;
                    const isCompleted = currentStageIndex >= 0 && stageIdx < currentStageIndex;

                    return (
                      <td
                        key={weekIndex}
                        className={cn(
                          "p-0 border-l border-border/30 h-12 relative",
                          week.isCurrentWeek && "bg-primary/5"
                        )}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "absolute inset-y-1 flex items-center justify-center",
                                isFirst ? "left-1 rounded-l-md" : "left-0",
                                isLast ? "right-1 rounded-r-md" : "right-0",
                                !isFirst && !isLast && "left-0 right-0",
                                isActive && "ring-2 ring-primary ring-inset shadow-md z-10",
                                !isActive && !isCompleted && "opacity-50"
                              )}
                              style={{
                                backgroundColor: stageForWeek.color,
                              }}
                            >
                              {/* Show stage name only on first cell of stage */}
                              {isFirst && (
                                <span className="text-[9px] font-semibold text-white truncate px-1">
                                  {stageForWeek.name}
                                </span>
                              )}
                              
                              {/* Active indicator on last cell */}
                              {isActive && isLast && (
                                <div className="absolute -right-0.5 top-1/2 -translate-y-1/2">
                                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                </div>
                              )}
                              
                              {/* Completed checkmark on first cell */}
                              {isCompleted && isFirst && (
                                <div className="absolute top-0.5 left-0.5">
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
                            <div className="font-medium">{stageForWeek.name}</div>
                            <div className="text-muted-foreground">
                              {stageForWeek.contractedWeeks} weeks
                            </div>
                            {isActive && (
                              <div className="text-primary font-medium">Current Stage</div>
                            )}
                            {isCompleted && (
                              <div className="text-green-500 font-medium">Completed</div>
                            )}
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TooltipProvider>
  );
};
