import React, { useMemo, useState } from 'react';
import { format, addWeeks, startOfWeek, differenceInWeeks } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface Project {
  id: string;
  name: string;
  code: string;
  current_stage: string;
  status: string;
  department?: string | null;
  practice_area?: string | null;
  contract_start_date?: string | null;
  contract_end_date?: string | null;
  stages?: string[] | null;
}

interface Department {
  id: string;
  name: string;
}

interface PracticeArea {
  id: string;
  name: string;
}

type GroupBy = 'department' | 'practice_area';

interface PipelineTimelineViewProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectClick?: (project: Project) => void;
  weeksToShow?: number;
  departments?: Department[];
  practiceAreas?: PracticeArea[];
}

// Color palette for groups
const GROUP_COLORS = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#f97316', // orange
  '#6366f1', // indigo
];

export const PipelineTimelineView: React.FC<PipelineTimelineViewProps> = ({
  projects,
  isLoading,
  onProjectClick,
  weeksToShow = 16,
  departments = [],
  practiceAreas = [],
}) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('department');
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });

  // Generate weeks for the timeline
  const weeks = useMemo(() => {
    return Array.from({ length: weeksToShow }, (_, i) => addWeeks(startDate, i));
  }, [startDate, weeksToShow]);

  // Build group color map
  const groupColorMap = useMemo(() => {
    const map: Record<string, string> = { 'Unassigned': '#6b7280' };
    const items = groupBy === 'department' ? departments : practiceAreas;
    items.forEach((item, index) => {
      map[item.name] = GROUP_COLORS[index % GROUP_COLORS.length];
    });
    return map;
  }, [groupBy, departments, practiceAreas]);

  // Get ordered groups
  const orderedGroups = useMemo(() => {
    const items = groupBy === 'department' ? departments : practiceAreas;
    return items.map(item => item.name);
  }, [groupBy, departments, practiceAreas]);

  // Group projects by department or practice area
  const projectsByGroup = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    orderedGroups.forEach(name => {
      grouped[name] = [];
    });
    grouped['Unassigned'] = [];

    projects.forEach(project => {
      const groupValue = groupBy === 'department' ? project.department : project.practice_area;
      const groupName = groupValue || 'Unassigned';
      
      if (grouped[groupName]) {
        grouped[groupName].push(project);
      } else {
        grouped['Unassigned'].push(project);
      }
    });

    return grouped;
  }, [projects, orderedGroups, groupBy]);

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
    <div className="space-y-4">
      {/* Grouping Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
        </div>
        <ToggleGroup
          type="single"
          value={groupBy}
          onValueChange={(value) => value && setGroupBy(value as GroupBy)}
          className="bg-muted/50 p-1 rounded-lg"
        >
          <ToggleGroupItem
            value="department"
            className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            Department
          </ToggleGroupItem>
          <ToggleGroupItem
            value="practice_area"
            className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm"
          >
            Practice Area
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header */}
          <div className="flex border-b border-border">
            {/* Group column header */}
            <div className="w-48 shrink-0 p-2 font-medium text-xs text-muted-foreground border-r border-border bg-muted/30">
              {groupBy === 'department' ? 'Department' : 'Practice Area'} / Project
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

          {/* Group rows */}
          {orderedGroups.map(groupName => {
            const groupProjects = projectsByGroup[groupName] || [];
            if (groupProjects.length === 0) return null;

            return (
              <div key={groupName} className="border-b border-border/50">
                {/* Group header */}
                <div className="flex items-center bg-muted/20">
                  <div className="w-48 shrink-0 p-2 border-r border-border flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: groupColorMap[groupName] || '#3b82f6' }}
                    />
                    <span className="font-medium text-xs truncate">{groupName}</span>
                    <span className="text-[10px] text-muted-foreground">({groupProjects.length})</span>
                  </div>
                  <div className="flex flex-1">
                    {weeks.map((_, i) => (
                      <div key={i} className="w-16 shrink-0 h-8 border-r border-border/30" />
                    ))}
                  </div>
                </div>

                {/* Project rows */}
                {groupProjects.map(project => {
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
                              backgroundColor: groupColorMap[groupBy === 'department' ? (project.department || 'Unassigned') : (project.practice_area || 'Unassigned')] || '#3b82f6',
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
          {projectsByGroup['Unassigned']?.length > 0 && (
            <div className="border-b border-border/50">
              <div className="flex items-center bg-muted/20">
                <div className="w-48 shrink-0 p-2 border-r border-border flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0 bg-gray-500" />
                  <span className="font-medium text-xs">Unassigned</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({projectsByGroup['Unassigned'].length})
                  </span>
                </div>
                <div className="flex flex-1">
                  {weeks.map((_, i) => (
                    <div key={i} className="w-16 shrink-0 h-8 border-r border-border/30" />
                  ))}
                </div>
              </div>

              {projectsByGroup['Unassigned'].map(project => {
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
    </div>
  );
};
