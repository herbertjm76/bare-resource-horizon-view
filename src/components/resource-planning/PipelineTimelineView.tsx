import React, { useMemo, useState, useRef, useCallback } from 'react';
import { format, addWeeks, startOfWeek, differenceInWeeks, parseISO, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2, Calendar, GripVertical, Settings2 } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { AddProjectStageDialog } from './AddProjectStageDialog';

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

interface StageWithDates {
  id: string;
  stageName: string;
  startDate: Date | null;
  contractedWeeks: number;
  color: string;
  orderIndex: number;
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
  weeksToShow = 24,
  departments = [],
  practiceAreas = [],
}) => {
  const { company } = useCompany();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [groupBy, setGroupBy] = useState<GroupBy>('department');
  const [selectedStage, setSelectedStage] = useState<{
    projectId: string;
    projectName: string;
    stageId: string;
    stageName: string;
    startDate: Date | null;
    contractedWeeks: number;
  } | null>(null);
  const [editDate, setEditDate] = useState<Date | undefined>(undefined);
  const [editWeeks, setEditWeeks] = useState<number>(4);
  const [dragState, setDragState] = useState<{
    stageId: string;
    startX: number;
    originalStartWeek: number;
    currentOffset: number;
    stage: StageWithDates;
    project: Project;
  } | null>(null);
  const [manageStagesProject, setManageStagesProject] = useState<Project | null>(null);
  
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const WEEK_WIDTH = 64; // Width of each week column in pixels

  // Fetch office stages for colors
  const { data: officeStages = [] } = useQuery({
    queryKey: ['office-stages', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_stages')
        .select('id, name, color, order_index, code')
        .eq('company_id', company.id)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Fetch project stages with start dates
  const { data: projectStagesData = [] } = useQuery({
    queryKey: ['project-stages-timeline', company?.id, projects.map(p => p.id)],
    queryFn: async () => {
      if (!company?.id || projects.length === 0) return [];
      const { data, error } = await supabase
        .from('project_stages')
        .select('id, project_id, stage_name, start_date, contracted_weeks, is_applicable')
        .eq('company_id', company.id)
        .in('project_id', projects.map(p => p.id));
      if (error) throw error;
      return data || [];
    },
    enabled: !!company?.id && projects.length > 0
  });

  // Mutation to update stage start date and contracted weeks
  const updateStageMutation = useMutation({
    mutationFn: async ({ stageId, startDate, contractedWeeks }: { stageId: string; startDate: Date | null; contractedWeeks: number }) => {
      const { error } = await supabase
        .from('project_stages')
        .update({
          start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null,
          contracted_weeks: contractedWeeks
        })
        .eq('id', stageId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Stage timeline updated');
      queryClient.invalidateQueries({ queryKey: ['project-stages-timeline'] });
      setSelectedStage(null);
    },
    onError: () => {
      toast.error('Failed to update stage');
    }
  });

  // Build stage info map
  const stageInfoMap = useMemo(() => {
    const map: Record<string, { color: string; orderIndex: number; id: string }> = {};
    officeStages?.forEach(s => {
      map[s.name] = { color: s.color || '#3b82f6', orderIndex: s.order_index, id: s.id };
    });
    return map;
  }, [officeStages]);

  // Build project stages map with start dates
  const projectStagesMap = useMemo(() => {
    const map: Record<string, Record<string, { 
      id: string; 
      startDate: string | null; 
      contractedWeeks: number;
    }>> = {};
    projectStagesData?.forEach(ps => {
      if (!map[ps.project_id]) {
        map[ps.project_id] = {};
      }
      map[ps.project_id][ps.stage_name] = {
        id: ps.id,
        startDate: ps.start_date,
        contractedWeeks: ps.contracted_weeks || 4
      };
    });
    return map;
  }, [projectStagesData]);

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

  // Get stages for a project with their timeline positions
  const getProjectStagesWithPositions = (project: Project): StageWithDates[] => {
    if (!project.stages || project.stages.length === 0) return [];
    
    return project.stages
      .map(stageName => {
        const info = stageInfoMap[stageName] || { color: '#6b7280', orderIndex: 999, id: '' };
        const stageData = projectStagesMap[project.id]?.[stageName];
        
        return {
          id: stageData?.id || '',
          stageName,
          startDate: stageData?.startDate ? parseISO(stageData.startDate) : null,
          contractedWeeks: stageData?.contractedWeeks || 4,
          color: info.color,
          orderIndex: info.orderIndex
        };
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  };

  // Calculate stage position on timeline
  const getStageTimelinePosition = (stage: StageWithDates) => {
    if (!stage.startDate) return null;
    
    const stageStart = stage.startDate;
    const stageEnd = addDays(stageStart, stage.contractedWeeks * 7);
    const timelineEnd = addWeeks(startDate, weeksToShow);

    // Check if stage overlaps with timeline
    if (stageEnd < startDate || stageStart > timelineEnd) {
      return null;
    }

    const startWeek = Math.max(0, differenceInWeeks(stageStart, startDate));
    const endWeek = Math.min(weeksToShow, differenceInWeeks(stageEnd, startDate));
    const width = Math.max(1, endWeek - startWeek);

    return { startWeek, width };
  };

  // Scroll controls
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 5 weeks worth
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Drag handlers for stage bars
  const handleDragStart = useCallback((
    e: React.MouseEvent,
    project: Project,
    stage: StageWithDates
  ) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!stage.startDate) return;
    
    const position = getStageTimelinePosition(stage);
    if (!position) return;
    
    setDragState({
      stageId: stage.id,
      startX: e.clientX,
      originalStartWeek: position.startWeek,
      currentOffset: 0,
      stage,
      project
    });
  }, []);

  const handleDragMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    
    const deltaX = e.clientX - dragState.startX;
    const weekOffset = Math.round(deltaX / WEEK_WIDTH);
    
    if (weekOffset !== dragState.currentOffset) {
      setDragState(prev => prev ? { ...prev, currentOffset: weekOffset } : null);
    }
  }, [dragState]);

  const handleDragEnd = useCallback(() => {
    if (!dragState || dragState.currentOffset === 0) {
      setDragState(null);
      return;
    }
    
    // Calculate new start date based on offset
    const newStartWeek = Math.max(0, dragState.originalStartWeek + dragState.currentOffset);
    const newStartDate = addWeeks(startDate, newStartWeek);
    
    // Save the new date
    updateStageMutation.mutate({
      stageId: dragState.stageId,
      startDate: newStartDate,
      contractedWeeks: dragState.stage.contractedWeeks
    });
    
    setDragState(null);
  }, [dragState, startDate, updateStageMutation]);

  // Handle stage click
  const handleStageClick = (
    e: React.MouseEvent, 
    project: Project, 
    stage: StageWithDates
  ) => {
    e.stopPropagation();
    // Don't open dialog if we just finished dragging
    if (dragState) return;
    
    setSelectedStage({
      projectId: project.id,
      projectName: project.name,
      stageId: stage.id,
      stageName: stage.stageName,
      startDate: stage.startDate,
      contractedWeeks: stage.contractedWeeks
    });
    setEditDate(stage.startDate || undefined);
    setEditWeeks(stage.contractedWeeks);
  };

  // Handle save
  const handleSaveStage = () => {
    if (!selectedStage) return;
    updateStageMutation.mutate({
      stageId: selectedStage.stageId,
      startDate: editDate || null,
      contractedWeeks: editWeeks
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
          </div>
          <div className="flex items-center gap-4">
            {/* Scroll Controls */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scroll('left')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scroll('right')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
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
        </div>

        <div 
          className="relative"
          onMouseMove={dragState ? handleDragMove : undefined}
          onMouseUp={dragState ? handleDragEnd : undefined}
          onMouseLeave={dragState ? handleDragEnd : undefined}
        >
          <div 
            ref={scrollContainerRef}
            className={cn(
              "overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent",
              dragState && "cursor-grabbing select-none"
            )}
            style={{ scrollBehavior: dragState ? 'auto' : 'smooth' }}
          >
            <div className="min-w-max">
              {/* Header */}
              <div className="flex border-b border-border sticky top-0 bg-background z-10">
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
                      const stages = getProjectStagesWithPositions(project);
                      const hasNoStagesWithDates = stages.every(s => !s.startDate);
                      
                      return (
                        <div
                          key={project.id}
                          className="flex items-center hover:bg-muted/30 cursor-pointer group"
                          onClick={() => onProjectClick?.(project)}
                        >
                          {/* Project name */}
                          <div className="w-48 shrink-0 p-2 border-r border-border">
                            <div className="flex items-center gap-1">
                              <div className="text-xs font-medium truncate group-hover:text-primary flex-1">
                                {project.name}
                              </div>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setManageStagesProject(project);
                                    }}
                                  >
                                    <Settings2 className="h-3 w-3 text-muted-foreground" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">Manage stages</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <div className="text-[10px] text-muted-foreground font-mono">
                              {project.code}
                            </div>
                          </div>

                          {/* Timeline bar */}
                          <div className="flex relative h-12">
                            {weeks.map((_, i) => (
                              <div key={i} className="w-16 shrink-0 border-r border-border/30" />
                            ))}
                            
                            {/* Stage bars */}
                            {stages.map((stage) => {
                              const position = getStageTimelinePosition(stage);
                              
                              if (!position) {
                                // Stage without start date - show as chip that can be clicked
                                if (!stage.startDate) {
                                  return (
                                    <Tooltip key={stage.stageName}>
                                      <TooltipTrigger asChild>
                                      <button
                                          className="absolute top-1 h-4 px-2 rounded text-[8px] font-medium text-foreground border border-dashed border-border bg-muted hover:bg-muted/80 transition-colors"
                                          style={{
                                            left: `${stages.indexOf(stage) * 52 + 4}px`,
                                          }}
                                          onClick={(e) => handleStageClick(e, project, stage)}
                                        >
                                          {stage.stageName.slice(0, 8)}
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="text-xs">Click to set start date for {stage.stageName}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                }
                                return null;
                              }
                              
                              const isDragging = dragState?.stageId === stage.id;
                              const dragOffset = isDragging ? dragState.currentOffset : 0;
                              const displayLeft = (position.startWeek + dragOffset) * WEEK_WIDTH;
                              
                              return (
                                <Tooltip key={stage.stageName} open={isDragging ? false : undefined}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-7 rounded-md flex items-center gap-1 pl-1 pr-2 text-[10px] font-medium text-white shadow-sm transition-all cursor-grab",
                                        isDragging ? "ring-2 ring-primary ring-offset-2 cursor-grabbing z-20 opacity-90" : "hover:ring-2 hover:ring-primary hover:ring-offset-1"
                                      )}
                                      style={{
                                        left: `${displayLeft}px`,
                                        width: `${Math.max(position.width * WEEK_WIDTH - 4, 48)}px`,
                                        backgroundColor: stage.color,
                                      }}
                                      onMouseDown={(e) => handleDragStart(e, project, stage)}
                                      onClick={(e) => !dragState && handleStageClick(e, project, stage)}
                                    >
                                      <GripVertical className="h-3 w-3 text-white/60 shrink-0" />
                                      <span className="truncate">{stage.stageName}</span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs">
                                      <p className="font-medium">{stage.stageName}</p>
                                      <p className="text-muted-foreground">
                                        {stage.startDate ? format(stage.startDate, 'MMM d, yyyy') : 'No start date'} 
                                        {' • '}{stage.contractedWeeks} weeks
                                      </p>
                                      <p className="text-primary mt-1">Drag to move • Click to edit</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                            
                            {/* Show message if no stages have dates */}
                            {hasNoStagesWithDates && stages.length > 0 && (
                              <div className="absolute inset-0 flex items-center pl-2">
                                <span className="text-[10px] text-muted-foreground italic">
                                  Click stage chips above to set dates
                                </span>
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
                    const stages = getProjectStagesWithPositions(project);
                    
                    return (
                      <div
                        key={project.id}
                        className="flex items-center hover:bg-muted/30 cursor-pointer group"
                        onClick={() => onProjectClick?.(project)}
                      >
                        <div className="w-48 shrink-0 p-2 border-r border-border">
                          <div className="flex items-center gap-1">
                            <div className="text-xs font-medium truncate group-hover:text-primary flex-1">
                              {project.name}
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setManageStagesProject(project);
                                  }}
                                >
                                  <Settings2 className="h-3 w-3 text-muted-foreground" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">Manage stages</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {project.code}
                          </div>
                        </div>

                        <div className="flex relative h-12">
                          {weeks.map((_, i) => (
                            <div key={i} className="w-16 shrink-0 border-r border-border/30" />
                          ))}
                          
                          {stages.map((stage) => {
                            const position = getStageTimelinePosition(stage);
                            
                            if (!position && !stage.startDate) {
                              return (
                                <Tooltip key={stage.stageName}>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="absolute top-1 h-4 px-2 rounded text-[8px] font-medium text-foreground border border-dashed border-border bg-muted hover:bg-muted/80 transition-colors"
                                      style={{
                                        left: `${stages.indexOf(stage) * 52 + 4}px`,
                                      }}
                                      onClick={(e) => handleStageClick(e, project, stage)}
                                    >
                                      {stage.stageName.slice(0, 8)}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Click to set start date</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            }
                            
                            if (!position) return null;
                            
                            const isDragging = dragState?.stageId === stage.id;
                            const dragOffset = isDragging ? dragState.currentOffset : 0;
                            const displayLeft = (position.startWeek + dragOffset) * WEEK_WIDTH;
                            
                            return (
                              <Tooltip key={stage.stageName} open={isDragging ? false : undefined}>
                                <TooltipTrigger asChild>
                                  <div
                                    className={cn(
                                      "absolute top-1/2 -translate-y-1/2 h-7 rounded-md flex items-center gap-1 pl-1 pr-2 text-[10px] font-medium text-white shadow-sm transition-all cursor-grab",
                                      isDragging ? "ring-2 ring-primary ring-offset-2 cursor-grabbing z-20 opacity-90" : "hover:ring-2 hover:ring-primary hover:ring-offset-1"
                                    )}
                                    style={{
                                      left: `${displayLeft}px`,
                                      width: `${Math.max(position.width * WEEK_WIDTH - 4, 48)}px`,
                                      backgroundColor: stage.color,
                                    }}
                                    onMouseDown={(e) => handleDragStart(e, project, stage)}
                                    onClick={(e) => !dragState && handleStageClick(e, project, stage)}
                                  >
                                    <GripVertical className="h-3 w-3 text-white/60 shrink-0" />
                                    <span className="truncate">{stage.stageName}</span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-xs">
                                    <p className="font-medium">{stage.stageName}</p>
                                    <p className="text-muted-foreground">
                                      {format(stage.startDate!, 'MMM d, yyyy')} • {stage.contractedWeeks} weeks
                                    </p>
                                    <p className="text-primary mt-1">Drag to move • Click to edit</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Stage Dialog */}
        <Dialog open={!!selectedStage} onOpenChange={() => setSelectedStage(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg">
                Edit Stage Timeline
              </DialogTitle>
            </DialogHeader>
            
            {selectedStage && (
              <div className="space-y-4 py-4">
                <div className="text-sm">
                  <span className="text-muted-foreground">Project:</span>{' '}
                  <span className="font-medium">{selectedStage.projectName}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Stage:</span>{' '}
                  <span className="font-medium">{selectedStage.stageName}</span>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !editDate && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {editDate ? format(editDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={editDate}
                        onSelect={setEditDate}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weeks">Duration (weeks)</Label>
                  <Input
                    id="weeks"
                    type="number"
                    min={1}
                    max={52}
                    value={editWeeks}
                    onChange={(e) => setEditWeeks(parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedStage(null)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveStage}
                disabled={updateStageMutation.isPending}
              >
                {updateStageMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Manage Stages Dialog */}
        {manageStagesProject && (
          <AddProjectStageDialog
            open={!!manageStagesProject}
            onOpenChange={(open) => !open && setManageStagesProject(null)}
            projectId={manageStagesProject.id}
            projectName={manageStagesProject.name}
            currentStages={manageStagesProject.stages || []}
            availableStages={officeStages.map(s => ({ id: s.id, name: s.name, code: s.code }))}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['project-stages-timeline'] });
              setManageStagesProject(null);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
};