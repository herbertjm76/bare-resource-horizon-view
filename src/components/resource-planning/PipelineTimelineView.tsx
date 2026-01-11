import React, { useMemo, useState, useRef, useCallback } from 'react';
import { format, addWeeks, startOfWeek, differenceInWeeks, parseISO, addDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Loader2, Calendar, GripVertical, Settings2, Pencil } from 'lucide-react';
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
import { colors } from '@/styles/colors';
import { toast } from 'sonner';
import { AddProjectStageDialog } from './AddProjectStageDialog';
import { UnscheduledStagesTray } from './UnscheduledStagesTray';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_STAGES, DEMO_PROJECTS, DEMO_TEAM_MEMBERS, DEMO_COMPANY_ID } from '@/data/demoData';

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
  officeStageId: string;
  stageName: string;
  stageCode: string;
  startDate: Date | null;
  contractedWeeks: number;
  color: string;
  orderIndex: number;
}

type GroupBy = 'department' | 'practice_area';

interface PipelineTimelineViewProps {
  projects: Project[];
  isLoading?: boolean;
  onProjectClick?: (project: Project, tab?: "info" | "team", stageId?: string) => void;
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
  const { isDemoMode } = useDemoAuth();
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
  const [expandedTrays, setExpandedTrays] = useState<Set<string>>(new Set());
  const timelineStartDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const WEEK_WIDTH = 64; // Width of each week column in pixels

  // Generate demo project stages with start dates and contracted weeks
  const generateDemoProjectStages = useCallback(() => {
    const stages: Array<{
      id: string;
      project_id: string;
      stage_name: string;
      start_date: string | null;
      contracted_weeks: number;
      is_applicable: boolean;
    }> = [];
    
    // Define stage durations by project (weeks per stage)
    const projectStageConfig: Record<string, { startOffset: number; durations: number[] }> = {
      '00000000-0000-0000-0001-000000000001': { startOffset: -8, durations: [4, 6, 8, 10, 12] },  // Skyline Tower - in SD
      '00000000-0000-0000-0001-000000000002': { startOffset: -4, durations: [3, 5, 6, 8, 10] },   // Greenfield Residence - in CON
      '00000000-0000-0000-0001-000000000003': { startOffset: -20, durations: [4, 8, 10, 12, 8] }, // Metro Health - in DOC
      '00000000-0000-0000-0001-000000000004': { startOffset: 2, durations: [4, 6, 8, 10, 8] },    // Urban Park - just starting
      '00000000-0000-0000-0001-000000000005': { startOffset: -6, durations: [3, 4, 6, 8, 6] },    // Boutique Hotel - in DD
      '00000000-0000-0000-0001-000000000006': { startOffset: 8, durations: [6, 8, 12, 16, 14] },  // Tech Campus - pipeline
      '00000000-0000-0000-0001-000000000007': { startOffset: -52, durations: [4, 6, 8, 10, 8] },  // Riverside - completed
    };
    
    DEMO_PROJECTS.forEach(project => {
      const config = projectStageConfig[project.id] || { startOffset: 0, durations: [4, 4, 4, 4, 4] };
      let cumulativeWeeks = config.startOffset;
      
      DEMO_STAGES.forEach((stage, idx) => {
        const stageStartDate = addWeeks(timelineStartDate, cumulativeWeeks);
        const contractedWeeks = config.durations[idx] || 4;
        
        stages.push({
          id: `demo-ps-${project.id}-${stage.id}`,
          project_id: project.id,
          stage_name: stage.name,
          start_date: format(stageStartDate, 'yyyy-MM-dd'),
          contracted_weeks: contractedWeeks,
          is_applicable: true
        });
        
        cumulativeWeeks += contractedWeeks;
      });
    });
    
    return stages;
  }, [timelineStartDate]);

  // Generate demo resource allocations for stages
  const generateDemoAllocations = useCallback(() => {
    const allocations: Array<{
      id: string;
      project_id: string;
      stage_id: string;
      resource_id: string;
      resource_type: string;
    }> = [];
    
    // Assign team members to projects/stages
    const projectTeamAssignments: Record<string, string[]> = {
      '00000000-0000-0000-0001-000000000001': ['00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000004'],
      '00000000-0000-0000-0001-000000000002': ['00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000007'],
      '00000000-0000-0000-0001-000000000003': ['00000000-0000-0000-0000-000000000008', '00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000009'],
      '00000000-0000-0000-0001-000000000004': ['00000000-0000-0000-0000-000000000006', '00000000-0000-0000-0000-000000000010'],
      '00000000-0000-0000-0001-000000000005': ['00000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000007'],
    };
    
    Object.entries(projectTeamAssignments).forEach(([projectId, memberIds]) => {
      DEMO_STAGES.forEach(stage => {
        memberIds.forEach((memberId, idx) => {
          allocations.push({
            id: `demo-alloc-${projectId}-${stage.id}-${idx}`,
            project_id: projectId,
            stage_id: stage.id,
            resource_id: memberId,
            resource_type: 'active'
          });
        });
      });
    });
    
    return allocations;
  }, []);

  // Fetch office stages for colors
  const { data: officeStages = [] } = useQuery({
    queryKey: ['office-stages', company?.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_STAGES.map(s => ({
          id: s.id,
          name: s.name,
          color: s.color,
          order_index: s.order_index,
          code: s.code,
          company_id: DEMO_COMPANY_ID
        }));
      }
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('office_stages')
        .select('id, name, color, order_index, code, company_id')
        .or(`company_id.eq.${company.id},company_id.is.null`)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: isDemoMode || !!company?.id
  });

  // Fetch project stages with start dates
  const { data: projectStagesData = [] } = useQuery({
    queryKey: ['project-stages-timeline', company?.id, projects.map(p => p.id), isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        const demoStages = generateDemoProjectStages();
        return demoStages.filter(s => projects.some(p => p.id === s.project_id));
      }
      if (!company?.id || projects.length === 0) return [];
      const { data, error } = await supabase
        .from('project_stages')
        .select('id, project_id, stage_name, start_date, contracted_weeks, is_applicable')
        .eq('company_id', company.id)
        .in('project_id', projects.map(p => p.id));
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || (!!company?.id && projects.length > 0)
  });

  // Fetch resource allocations for project stages
  // RULEBOOK: Filter by resource_type='active' for active team views
  const { data: stageAllocationsData = [] } = useQuery({
    queryKey: ['stage-allocations-timeline', company?.id, projects.map(p => p.id), isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        const demoAllocations = generateDemoAllocations();
        return demoAllocations.filter(a => projects.some(p => p.id === a.project_id));
      }
      if (!company?.id || projects.length === 0) return [];
      const { data, error } = await supabase
        .from('project_resource_allocations')
        .select(`
          id,
          project_id,
          stage_id,
          resource_id,
          resource_type
        `)
        .eq('company_id', company.id)
        .eq('resource_type', 'active')
        .in('project_id', projects.map(p => p.id));
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || (!!company?.id && projects.length > 0)
  });

  // Fetch profiles for avatars
  const { data: profilesData = [] } = useQuery({
    queryKey: ['profiles-avatars', company?.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return DEMO_TEAM_MEMBERS.map(m => ({
          id: m.id,
          first_name: m.first_name,
          last_name: m.last_name,
          avatar_url: m.avatar_url
        }));
      }
      if (!company?.id) return [];
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('company_id', company.id);
      if (error) throw error;
      return data || [];
    },
    enabled: isDemoMode || !!company?.id
  });

  // Build profiles map for quick lookup
  const profilesMap = useMemo(() => {
    const map: Record<string, { firstName: string; lastName: string; avatarUrl: string | null }> = {};
    profilesData?.forEach(p => {
      map[p.id] = {
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        avatarUrl: p.avatar_url
      };
    });
    return map;
  }, [profilesData]);

  // Build stage allocations map - maps project_stage.id to resource IDs
  const stageAllocationsMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    stageAllocationsData?.forEach(alloc => {
      // We need to map stage_id (office_stages.id) + project_id to get project_stages records
      // Then map resources to project_stages.id
      const key = `${alloc.project_id}-${alloc.stage_id}`;
      if (!map[key]) {
        map[key] = [];
      }
      if (alloc.resource_type === 'active' && !map[key].includes(alloc.resource_id)) {
        map[key].push(alloc.resource_id);
      }
    });
    return map;
  }, [stageAllocationsData]);

  // Mutation to update stage start date and contracted weeks with optimistic updates
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
    onMutate: async ({ stageId, startDate, contractedWeeks }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['project-stages-timeline'] });
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(['project-stages-timeline', company?.id, projects.map(p => p.id)]);
      
      // Optimistically update the cache
      queryClient.setQueryData(
        ['project-stages-timeline', company?.id, projects.map(p => p.id)],
        (old: any[] | undefined) => {
          if (!old) return old;
          return old.map(stage => 
            stage.id === stageId 
              ? { ...stage, start_date: startDate ? format(startDate, 'yyyy-MM-dd') : null, contracted_weeks: contractedWeeks }
              : stage
          );
        }
      );
      
      return { previousData };
    },
    onSuccess: () => {
      setSelectedStage(null);
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ['project-stages-timeline', company?.id, projects.map(p => p.id)],
          context.previousData
        );
      }
      toast.error('Failed to update stage');
    },
    onSettled: () => {
      // Refetch in background to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['project-stages-timeline'] });
    }
  });

  const normalizeStageName = useCallback((name: string) => name.trim().toLowerCase(), []);

  // Build stage info map from office_stages (keyed by normalized name)
  // If both a global default and a company-specific stage exist with the same name,
  // prefer the company-specific one.
  const stageInfoMap = useMemo(() => {
    const map: Record<string, { color: string; orderIndex: number; id: string; code: string }> = {};

    // Insert global defaults first...
    officeStages
      ?.filter(s => s.company_id == null)
      .forEach(s => {
        const key = normalizeStageName(s.name);
        map[key] = {
          color: s.color && s.color.trim() !== '' ? s.color : colors.defaults.stage,
          orderIndex: s.order_index,
          id: s.id,
          code: s.code || ''
        };
      });

    // ...then override with company-specific stages
    officeStages
      ?.filter(s => s.company_id != null)
      .forEach(s => {
        const key = normalizeStageName(s.name);
        map[key] = {
          color: s.color && s.color.trim() !== '' ? s.color : colors.defaults.stage,
          orderIndex: s.order_index,
          id: s.id,
          code: s.code || ''
        };
      });

    return map;
  }, [officeStages, normalizeStageName]);

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
    return Array.from({ length: weeksToShow }, (_, i) => addWeeks(timelineStartDate, i));
  }, [timelineStartDate, weeksToShow]);

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
  // Uses projectStagesData as the source of truth for stage names (not project.stages which may be empty)
  const getProjectStagesWithPositions = useCallback((project: Project): StageWithDates[] => {
    const projectStagesList = projectStagesMap[project.id];
    if (!projectStagesList || Object.keys(projectStagesList).length === 0) return [];

    return Object.entries(projectStagesList)
      .map(([stageName, stageData]) => {
        const info = stageInfoMap[normalizeStageName(stageName)];

        // Use stage color from office_stages, fallback to theme token only if not found
        const stageColor = info?.color || colors.defaults.stage;

        return {
          id: stageData.id,
          officeStageId: info?.id || '',
          stageName,
          stageCode: info?.code || stageName.substring(0, 3).toUpperCase(),
          startDate: stageData.startDate ? parseISO(stageData.startDate) : null,
          contractedWeeks: stageData.contractedWeeks || 4,
          color: stageColor,
          orderIndex: info?.orderIndex ?? 999
        };
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [stageInfoMap, projectStagesMap, normalizeStageName]);

  // Calculate stage position on timeline
  const getStageTimelinePosition = (stage: StageWithDates) => {
    if (!stage.startDate) return null;
    
    const stageStart = stage.startDate;
    const stageEnd = addDays(stageStart, stage.contractedWeeks * 7);
    const timelineEnd = addWeeks(timelineStartDate, weeksToShow);

    // Check if stage overlaps with timeline
    if (stageEnd < timelineStartDate || stageStart > timelineEnd) {
      return null;
    }

    const startWeek = Math.max(0, differenceInWeeks(stageStart, timelineStartDate));
    const endWeek = Math.min(weeksToShow, differenceInWeeks(stageEnd, timelineStartDate));
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

  // Check if a stage position would overlap with other stages
  const checkOverlap = useCallback((
    projectId: string,
    stageId: string, 
    newStartWeek: number, 
    durationWeeks: number
  ): { overlaps: boolean; adjustedStartWeek: number } => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return { overlaps: false, adjustedStartWeek: newStartWeek };
    
    const stages = getProjectStagesWithPositions(project);
    const otherScheduledStages = stages.filter(s => s.startDate && s.id !== stageId);
    
    const newEndWeek = newStartWeek + durationWeeks;
    
    // Check for overlap with each other stage
    for (const otherStage of otherScheduledStages) {
      const otherPosition = getStageTimelinePosition(otherStage);
      if (!otherPosition) continue;
      
      const otherStart = otherPosition.startWeek;
      const otherEnd = otherPosition.startWeek + otherPosition.width;
      
      // Check if ranges overlap
      if (newStartWeek < otherEnd && newEndWeek > otherStart) {
        return { overlaps: true, adjustedStartWeek: newStartWeek };
      }
    }
    
    return { overlaps: false, adjustedStartWeek: newStartWeek };
  }, [projects, getStageTimelinePosition]);

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
      // Calculate target position and check for collision
      const targetStartWeek = Math.max(0, dragState.originalStartWeek + weekOffset);
      const { overlaps } = checkOverlap(
        dragState.project.id,
        dragState.stageId,
        targetStartWeek,
        dragState.stage.contractedWeeks
      );
      
      // Only update offset if it doesn't cause overlap
      if (!overlaps) {
        setDragState(prev => prev ? { ...prev, currentOffset: weekOffset } : null);
      }
    }
  }, [dragState, checkOverlap]);

  // Find nearest non-overlapping position
  const findNearestValidPosition = useCallback((
    projectId: string,
    stageId: string,
    targetStartWeek: number,
    durationWeeks: number
  ): number => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return targetStartWeek;
    
    const stages = getProjectStagesWithPositions(project);
    const otherScheduledStages = stages.filter(s => s.startDate && s.id !== stageId);
    
    if (otherScheduledStages.length === 0) return Math.max(0, targetStartWeek);
    
    // Get occupied ranges
    const occupiedRanges: { start: number; end: number }[] = [];
    for (const otherStage of otherScheduledStages) {
      const pos = getStageTimelinePosition(otherStage);
      if (pos) {
        occupiedRanges.push({ start: pos.startWeek, end: pos.startWeek + pos.width });
      }
    }
    
    // Sort by start
    occupiedRanges.sort((a, b) => a.start - b.start);
    
    const targetEnd = targetStartWeek + durationWeeks;
    
    // Check if target position is valid
    let isValid = true;
    for (const range of occupiedRanges) {
      if (targetStartWeek < range.end && targetEnd > range.start) {
        isValid = false;
        break;
      }
    }
    
    if (isValid) return Math.max(0, targetStartWeek);
    
    // Find nearest gap that fits
    let bestPosition = targetStartWeek;
    let minDistance = Infinity;
    
    // Try position before first occupied range
    if (occupiedRanges[0].start >= durationWeeks) {
      const pos = occupiedRanges[0].start - durationWeeks;
      const distance = Math.abs(pos - targetStartWeek);
      if (distance < minDistance) {
        minDistance = distance;
        bestPosition = pos;
      }
    }
    
    // Try gaps between occupied ranges
    for (let i = 0; i < occupiedRanges.length - 1; i++) {
      const gapStart = occupiedRanges[i].end;
      const gapEnd = occupiedRanges[i + 1].start;
      const gapSize = gapEnd - gapStart;
      
      if (gapSize >= durationWeeks) {
        // Fit at start of gap
        const distance = Math.abs(gapStart - targetStartWeek);
        if (distance < minDistance) {
          minDistance = distance;
          bestPosition = gapStart;
        }
      }
    }
    
    // Try position after last occupied range
    const afterLast = occupiedRanges[occupiedRanges.length - 1].end;
    const distanceAfter = Math.abs(afterLast - targetStartWeek);
    if (distanceAfter < minDistance) {
      bestPosition = afterLast;
    }
    
    return Math.max(0, bestPosition);
  }, [projects, getStageTimelinePosition]);

  // Track if we just finished dragging to prevent project click
  const justDraggedRef = useRef(false);
  
  const handleDragEnd = useCallback(() => {
    if (!dragState) {
      return;
    }
    
    // Mark that we just finished dragging
    justDraggedRef.current = true;
    setTimeout(() => {
      justDraggedRef.current = false;
    }, 100);
    
    if (dragState.currentOffset === 0) {
      setDragState(null);
      return;
    }
    
    // Calculate target start week
    const targetStartWeek = Math.max(0, dragState.originalStartWeek + dragState.currentOffset);
    
    // Find valid position that doesn't overlap
    const validStartWeek = findNearestValidPosition(
      dragState.project.id,
      dragState.stageId,
      targetStartWeek,
      dragState.stage.contractedWeeks
    );
    
    const newStartDate = addWeeks(timelineStartDate, validStartWeek);
    
    // Save the new date directly without any popup
    updateStageMutation.mutate({
      stageId: dragState.stageId,
      startDate: newStartDate,
      contractedWeeks: dragState.stage.contractedWeeks
    });
    
    setDragState(null);
  }, [dragState, timelineStartDate, updateStageMutation, findNearestValidPosition]);

  // Handle stage click - for scheduled stages, open dialog; for unscheduled, auto-schedule
  const handleStageClick = (
    e: React.MouseEvent, 
    project: Project, 
    stage: StageWithDates
  ) => {
    e.stopPropagation();
    // Don't open dialog if we just finished dragging
    if (dragState) return;
    
    // For unscheduled stages, auto-schedule to next available position
    if (!stage.startDate) {
      const validStartWeek = findNearestValidPosition(
        project.id,
        stage.id,
        0, // Start from beginning of timeline
        stage.contractedWeeks
      );
      const newStartDate = addWeeks(timelineStartDate, validStartWeek);
      
      updateStageMutation.mutate({
        stageId: stage.id,
        startDate: newStartDate,
        contractedWeeks: stage.contractedWeeks
      });
      return;
    }
    
    // For scheduled stages, open the dialog for editing
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

  // Toggle tray for a project
  const toggleTray = (projectId: string) => {
    setExpandedTrays(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  // Handle drag start from the unscheduled tray
  const handleTrayDragStart = (e: React.DragEvent, project: Project, stage: StageWithDates) => {
    e.dataTransfer.setData('stageId', stage.id);
    e.dataTransfer.setData('stageName', stage.stageName);
    e.dataTransfer.setData('projectId', project.id);
    e.dataTransfer.setData('contractedWeeks', stage.contractedWeeks.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  // Handle drop on the timeline
  const handleTimelineDrop = (e: React.DragEvent, weekIndex: number, projectId: string) => {
    e.preventDefault();
    const stageId = e.dataTransfer.getData('stageId');
    const contractedWeeks = parseInt(e.dataTransfer.getData('contractedWeeks')) || 4;
    const draggedProjectId = e.dataTransfer.getData('projectId');
    
    if (!stageId) return;
    
    // Only allow drop on the same project's timeline
    if (draggedProjectId !== projectId) return;
    
    // Find valid position that doesn't overlap
    const validStartWeek = findNearestValidPosition(
      projectId,
      stageId,
      weekIndex,
      contractedWeeks
    );
    
    const dropDate = addWeeks(timelineStartDate, validStartWeek);
    
    updateStageMutation.mutate({
      stageId,
      startDate: dropDate,
      contractedWeeks
    });
  };

  const handleTimelineDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
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
                      const unscheduledStages = stages.filter(s => !s.startDate);
                      const isTrayOpen = expandedTrays.has(project.id);
                      
                      return (
                        <div key={project.id} className="border-b border-border/20 last:border-b-0">
                          <div
                            className="flex items-center hover:bg-muted/30 group"
                          >
                            {/* Project name */}
                            <div className="w-48 shrink-0 p-2 border-r border-border">
                              <div className="flex items-center gap-1">
                                <div className="text-xs font-medium truncate flex-1">
                                  {project.name}
                                </div>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-opacity"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onProjectClick?.(project, "info");
                                      }}
                                    >
                                      <Pencil className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="text-xs">Edit project</p>
                                  </TooltipContent>
                                </Tooltip>
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
                                <div 
                                  key={i} 
                                  className="w-16 shrink-0 border-r border-border/30"
                                  onDragOver={handleTimelineDragOver}
                                  onDrop={(e) => handleTimelineDrop(e, i, project.id)}
                                />
                              ))}
                              
                              {/* Stage bars - only scheduled ones */}
                              {stages.filter(s => s.startDate).map((stage) => {
                                const position = getStageTimelinePosition(stage);
                                if (!position) return null;
                                
                                const isDragging = dragState?.stageId === stage.id;
                                const dragOffset = isDragging ? dragState.currentOffset : 0;
                                const displayLeft = (position.startWeek + dragOffset) * WEEK_WIDTH;
                                
                                // Get resources assigned to this stage
                                const allocationKey = `${project.id}-${stage.officeStageId}`;
                                const resourceIds = stageAllocationsMap[allocationKey] || [];
                                const stageResources = resourceIds.slice(0, 3).map(id => profilesMap[id]).filter(Boolean);
                                const extraCount = resourceIds.length > 3 ? resourceIds.length - 3 : 0;
                                
                                return (
                                  <Tooltip key={stage.stageName} open={isDragging ? false : undefined}>
                                    <TooltipTrigger asChild>
                                      <div
                                        className={cn(
                                          "absolute top-1/2 -translate-y-1/2 h-8 rounded-md flex items-center gap-1.5 px-1.5 text-[10px] font-medium text-white shadow-sm transition-all cursor-pointer",
                                          isDragging ? "ring-2 ring-primary ring-offset-2 cursor-grabbing z-20 opacity-90" : "hover:ring-2 hover:ring-primary hover:ring-offset-1"
                                        )}
                                        style={{
                                          left: `${displayLeft}px`,
                                          width: `${Math.max(position.width * WEEK_WIDTH - 4, 64)}px`,
                                          backgroundColor: stage.color,
                                        }}
                                        onMouseDown={(e) => handleDragStart(e, project, stage)}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          // Only trigger click if not dragging
                                          if (!dragState) {
                                            onProjectClick?.(project, "team", stage.officeStageId);
                                          }
                                        }}
                                      >
                                        <GripVertical className="h-3 w-3 text-white/60 shrink-0" />
                                        <span className="font-semibold shrink-0">{stage.stageCode}</span>
                                        <span className="text-white/70 shrink-0">•</span>
                                        <span className="text-white/80 shrink-0">{stage.contractedWeeks}w</span>
                                        {stageResources.length > 0 && (
                                          <div className="flex -space-x-1.5 ml-auto shrink-0">
                                            {stageResources.map((resource, idx) => (
                                              <div
                                                key={idx}
                                                className="h-5 w-5 rounded-full border border-white/50 bg-white/20 flex items-center justify-center text-[8px] font-medium overflow-hidden"
                                                title={`${resource.firstName} ${resource.lastName}`}
                                              >
                                                {resource.avatarUrl ? (
                                                  <img src={resource.avatarUrl} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                  <span>{resource.firstName?.[0]}{resource.lastName?.[0]}</span>
                                                )}
                                              </div>
                                            ))}
                                            {extraCount > 0 && (
                                              <div className="h-5 w-5 rounded-full border border-white/50 bg-white/30 flex items-center justify-center text-[8px] font-medium">
                                                +{extraCount}
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <div className="text-xs">
                                        <p className="font-medium">{stage.stageName}</p>
                                        <p className="text-muted-foreground">
                                          {stage.startDate ? format(stage.startDate, 'MMM d, yyyy') : 'No start date'} 
                                          {' • '}{stage.contractedWeeks} weeks
                                        </p>
                                        {resourceIds.length > 0 && (
                                          <p className="text-muted-foreground">{resourceIds.length} resource{resourceIds.length !== 1 ? 's' : ''} assigned</p>
                                        )}
                                        <p className="text-primary mt-1">Click to view team • Drag to move</p>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                );
                              })}
                            </div>
                          </div>
                          
                          {/* Expandable Tray for unscheduled stages */}
                          {unscheduledStages.length > 0 && (
                            <div className="flex border-t border-border/10 bg-muted/10">
                              <div className="w-48 shrink-0 p-1.5 border-r border-border">
                                <UnscheduledStagesTray
                                  stages={stages}
                                  isOpen={isTrayOpen}
                                  onToggle={() => toggleTray(project.id)}
                                  onStageClick={(e, stage) => handleStageClick(e, project, stage)}
                                  onDragStart={(e, stage) => handleTrayDragStart(e, project, stage)}
                                />
                              </div>
                              <div className="flex flex-1">
                                {weeks.map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-16 shrink-0 border-r border-border/20 min-h-[2rem]",
                                      isTrayOpen && "bg-primary/5 border-dashed"
                                    )}
                                    onDragOver={handleTimelineDragOver}
                                    onDrop={(e) => handleTimelineDrop(e, i, project.id)}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
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
                    const unscheduledStages = stages.filter(s => !s.startDate);
                    const isTrayOpen = expandedTrays.has(project.id);
                    
                    return (
                      <div key={project.id} className="border-b border-border/20 last:border-b-0">
                        <div
                          className="flex items-center hover:bg-muted/30 cursor-pointer group"
                          onClick={() => onProjectClick?.(project, "info")}
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
                              <div 
                                key={i} 
                                className="w-16 shrink-0 border-r border-border/30"
                                onDragOver={handleTimelineDragOver}
                                onDrop={(e) => handleTimelineDrop(e, i, project.id)}
                              />
                            ))}
                            
                            {/* Stage bars - only scheduled ones */}
                            {stages.filter(s => s.startDate).map((stage) => {
                              const position = getStageTimelinePosition(stage);
                              if (!position) return null;
                              
                              const isDragging = dragState?.stageId === stage.id;
                              const dragOffset = isDragging ? dragState.currentOffset : 0;
                              const displayLeft = (position.startWeek + dragOffset) * WEEK_WIDTH;
                              
                              // Get resources assigned to this stage
                              const allocationKey = `${project.id}-${stage.officeStageId}`;
                              const resourceIds = stageAllocationsMap[allocationKey] || [];
                              const stageResources = resourceIds.slice(0, 3).map(id => profilesMap[id]).filter(Boolean);
                              const extraCount = resourceIds.length > 3 ? resourceIds.length - 3 : 0;
                              
                              return (
                                <Tooltip key={stage.stageName} open={isDragging ? false : undefined}>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={cn(
                                        "absolute top-1/2 -translate-y-1/2 h-8 rounded-md flex items-center gap-1.5 px-1.5 text-[10px] font-medium text-white shadow-sm transition-all cursor-pointer",
                                        isDragging ? "ring-2 ring-primary ring-offset-2 cursor-grabbing z-20 opacity-90" : "hover:ring-2 hover:ring-primary hover:ring-offset-1"
                                      )}
                                      style={{
                                        left: `${displayLeft}px`,
                                        width: `${Math.max(position.width * WEEK_WIDTH - 4, 64)}px`,
                                        backgroundColor: stage.color,
                                      }}
                                      onMouseDown={(e) => handleDragStart(e, project, stage)}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (!dragState) {
                                          onProjectClick?.(project, "team", stage.officeStageId);
                                        }
                                      }}
                                    >
                                      <GripVertical className="h-3 w-3 text-white/60 shrink-0" />
                                      <span className="font-semibold shrink-0">{stage.stageCode}</span>
                                      <span className="text-white/70 shrink-0">•</span>
                                      <span className="text-white/80 shrink-0">{stage.contractedWeeks}w</span>
                                      {stageResources.length > 0 && (
                                        <div className="flex -space-x-1.5 ml-auto shrink-0">
                                          {stageResources.map((resource, idx) => (
                                            <div
                                              key={idx}
                                              className="h-5 w-5 rounded-full border border-white/50 bg-white/20 flex items-center justify-center text-[8px] font-medium overflow-hidden"
                                              title={`${resource.firstName} ${resource.lastName}`}
                                            >
                                              {resource.avatarUrl ? (
                                                <img src={resource.avatarUrl} alt="" className="h-full w-full object-cover" />
                                              ) : (
                                                <span>{resource.firstName?.[0]}{resource.lastName?.[0]}</span>
                                              )}
                                            </div>
                                          ))}
                                          {extraCount > 0 && (
                                            <div className="h-5 w-5 rounded-full border border-white/50 bg-white/30 flex items-center justify-center text-[8px] font-medium">
                                              +{extraCount}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-xs">
                                      <p className="font-medium">{stage.stageName}</p>
                                      <p className="text-muted-foreground">
                                        {format(stage.startDate!, 'MMM d, yyyy')} • {stage.contractedWeeks} weeks
                                      </p>
                                      {resourceIds.length > 0 && (
                                        <p className="text-muted-foreground">{resourceIds.length} resource{resourceIds.length !== 1 ? 's' : ''} assigned</p>
                                      )}
                                      <p className="text-primary mt-1">Click to view team • Drag to move</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </div>
                        
                        {/* Expandable Tray for unscheduled stages */}
                        {unscheduledStages.length > 0 && (
                          <div className="flex border-t border-border/10 bg-muted/10">
                            <div className="w-48 shrink-0 p-1.5 border-r border-border">
                              <UnscheduledStagesTray
                                stages={stages}
                                isOpen={isTrayOpen}
                                onToggle={() => toggleTray(project.id)}
                                onStageClick={(e, stage) => handleStageClick(e, project, stage)}
                                onDragStart={(e, stage) => handleTrayDragStart(e, project, stage)}
                              />
                            </div>
                            <div className="flex flex-1">
                              {weeks.map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={cn(
                                      "w-16 shrink-0 border-r border-border/20 min-h-[2rem]",
                                      isTrayOpen && "bg-primary/5 border-dashed"
                                    )}
                                    onDragOver={handleTimelineDragOver}
                                    onDrop={(e) => handleTimelineDrop(e, i, project.id)}
                                  />
                                ))}
                            </div>
                          </div>
                        )}
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