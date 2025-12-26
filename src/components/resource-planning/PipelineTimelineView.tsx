import React, { useMemo } from 'react';
import { format, addWeeks, startOfWeek, differenceInWeeks, isWithinInterval } from 'date-fns';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

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

interface PipelineTimelineViewProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectClick?: (project: Project) => void;
  weeksToShow?: number;
}

export const PipelineTimelineView: React.FC<PipelineTimelineViewProps> = ({
  projects,
  isLoading,
  onProjectClick,
  weeksToShow = 16,
}) => {
  const { data: stages } = useOfficeStages();
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate weeks for the timeline
  const weeks = useMemo(() => {
    return Array.from({ length: weeksToShow }, (_, i) => addWeeks(startDate, i));
  }, [startDate, weeksToShow]);

  // Build stage color map
  const stageColorMap = useMemo(() => {
    const map: Record<string, string> = { 'Unassigned': '#6b7280' };
    stages?.forEach(s => {
      map[s.name] = s.color || '#3b82f6';
    });
    return map;
  }, [stages]);

  // Order stages by order_index
  const orderedStages = useMemo(() => {
    if (!stages) return [];
    return [...stages].sort((a, b) => a.order_index - b.order_index);
  }, [stages]);

  // Group projects by current stage
  const projectsByStage = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    orderedStages.forEach(s => {
      grouped[s.name] = [];
    });
    grouped['Unassigned'] = [];

    projects.forEach(project => {
      const stage = project.current_stage || 'Unassigned';
      if (grouped[stage]) {
        grouped[stage].push(project);
      } else {
        grouped['Unassigned'].push(project);
      }
    });

    return grouped;
  }, [projects, orderedStages]);

  // Calculate project position on timeline
  const getProjectTimelinePosition = (project: Project) => {
    if (!project.contract_start_date || !project.contract_end_date) {
      return null;
    }

    const projectStart = new Date(project.contract_start_date);
    const projectEnd = new Date(project.contract_end_date);
    const timelineEnd = addWeeks(startDate, weeksToShow);

    // Check if project overlaps with timeline
    if (projectEnd < startDate || projectStart > timelineEnd) {
      return null;
    }

    const startWeek = Math.max(0, differenceInWeeks(projectStart, startDate));
    const endWeek = Math.min(weeksToShow, differenceInWeeks(projectEnd, startDate) + 1);
    const width = Math.max(1, endWeek - startWeek);

    return { startWeek, width };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="flex border-b border-border">
          {/* Stage column header */}
          <div className="w-48 shrink-0 p-2 font-medium text-xs text-muted-foreground border-r border-border bg-muted/30">
            Stage / Project
          </div>
          {/* Week headers */}
          <div className="flex">
            {weeks.map((week, i) => (
              <div
                key={i}
                className={cn(
                  "w-16 shrink-0 p-2 text-center text-[10px] font-medium border-r border-border/50",
                  i === 0 && "bg-primary/10"
                )}
              >
                <div className="text-muted-foreground">{format(week, 'MMM d')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage rows */}
        {orderedStages.map(stage => {
          const stageProjects = projectsByStage[stage.name] || [];
          if (stageProjects.length === 0) return null;

          return (
            <div key={stage.id} className="border-b border-border/50">
              {/* Stage header */}
              <div className="flex items-center bg-muted/20">
                <div className="w-48 shrink-0 p-2 border-r border-border flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stage.color || '#3b82f6' }}
                  />
                  <span className="font-medium text-xs truncate">{stage.name}</span>
                  <span className="text-[10px] text-muted-foreground">({stageProjects.length})</span>
                </div>
                <div className="flex flex-1">
                  {weeks.map((_, i) => (
                    <div key={i} className="w-16 shrink-0 h-8 border-r border-border/30" />
                  ))}
                </div>
              </div>

              {/* Project rows */}
              {stageProjects.map(project => {
                const position = getProjectTimelinePosition(project);
                
                return (
                  <div
                    key={project.id}
                    className="flex items-center hover:bg-muted/30 cursor-pointer group"
                    onClick={() => onProjectClick?.(project)}
                  >
                    {/* Project name */}
                    <div className="w-48 shrink-0 p-2 border-r border-border">
                      <div className="text-xs font-medium truncate group-hover:text-primary">
                        {project.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-mono">
                        {project.code}
                      </div>
                    </div>

                    {/* Timeline bar */}
                    <div className="flex relative h-10">
                      {weeks.map((_, i) => (
                        <div key={i} className="w-16 shrink-0 border-r border-border/30" />
                      ))}
                      
                      {position && (
                        <div
                          className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md flex items-center px-2 text-[10px] font-medium text-white shadow-sm transition-all"
                          style={{
                            left: `${position.startWeek * 64}px`,
                            width: `${position.width * 64 - 4}px`,
                            backgroundColor: stageColorMap[project.current_stage] || '#3b82f6',
                          }}
                        >
                          <span className="truncate">{project.code}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}

        {/* Unassigned projects */}
        {projectsByStage['Unassigned']?.length > 0 && (
          <div className="border-b border-border/50">
            <div className="flex items-center bg-muted/20">
              <div className="w-48 shrink-0 p-2 border-r border-border flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shrink-0 bg-gray-500" />
                <span className="font-medium text-xs">Unassigned</span>
                <span className="text-[10px] text-muted-foreground">
                  ({projectsByStage['Unassigned'].length})
                </span>
              </div>
              <div className="flex flex-1">
                {weeks.map((_, i) => (
                  <div key={i} className="w-16 shrink-0 h-8 border-r border-border/30" />
                ))}
              </div>
            </div>

            {projectsByStage['Unassigned'].map(project => {
              const position = getProjectTimelinePosition(project);
              
              return (
                <div
                  key={project.id}
                  className="flex items-center hover:bg-muted/30 cursor-pointer group"
                  onClick={() => onProjectClick?.(project)}
                >
                  <div className="w-48 shrink-0 p-2 border-r border-border">
                    <div className="text-xs font-medium truncate group-hover:text-primary">
                      {project.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-mono">
                      {project.code}
                    </div>
                  </div>

                  <div className="flex relative h-10">
                    {weeks.map((_, i) => (
                      <div key={i} className="w-16 shrink-0 border-r border-border/30" />
                    ))}
                    
                    {position && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-6 rounded-md flex items-center px-2 text-[10px] font-medium text-white shadow-sm bg-gray-500"
                        style={{
                          left: `${position.startWeek * 64}px`,
                          width: `${position.width * 64 - 4}px`,
                        }}
                      >
                        <span className="truncate">{project.code}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
