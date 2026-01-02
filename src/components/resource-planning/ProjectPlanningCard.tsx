import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, CalendarDays, Plus, Settings, Calendar, Users } from 'lucide-react';
import { StageTeamCompositionEditor } from '@/components/projects/team-composition/StageTeamCompositionEditor';
import { AddProjectStageDialog } from './AddProjectStageDialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useOfficeStages } from '@/hooks/useOfficeStages';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName, getProjectSecondaryText } from '@/utils/projectDisplay';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_STAGES, DEMO_ROLES } from '@/data/demoData';

interface ProjectStage {
  id: string;
  name: string;
  code?: string;
  contractedWeeks?: number;
}

interface OfficeStage {
  id: string;
  name: string;
  code?: string | null;
  color?: string | null;
}

interface ProjectPlanningCardProps {
  project: {
    id: string;
    name: string;
    code: string;
    status: string;
    current_stage?: string;
    stages?: string[] | null;
  };
  stages: ProjectStage[];
  availableStages: OfficeStage[];
  showBudget?: boolean;
  onUpdate?: () => void;
}

export const ProjectPlanningCard: React.FC<ProjectPlanningCardProps> = ({
  project,
  stages,
  availableStages,
  showBudget = false,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showStageDialog, setShowStageDialog] = useState(false);
  const { company } = useCompany();
  const { data: officeStages } = useOfficeStages();
  const { projectDisplayPreference } = useAppSettings();
  const { isDemoMode } = useDemoAuth();

  // Generate demo project stages with contracted weeks
  const generateDemoProjectStages = (projectId: string) => {
    const stageWeeks: Record<string, number[]> = {
      '00000000-0000-0000-0001-000000000001': [4, 6, 8, 12, 16], // Skyline Tower
      '00000000-0000-0000-0001-000000000002': [3, 5, 7, 10, 14], // Harbor View
      '00000000-0000-0000-0001-000000000003': [2, 4, 6, 14, 18], // Metro Health
      '00000000-0000-0000-0001-000000000004': [4, 8, 10, 12, 8],  // Urban Park
      '00000000-0000-0000-0001-000000000005': [3, 4, 6, 8, 10],   // Boutique Hotel
      '00000000-0000-0000-0001-000000000006': [6, 10, 14, 20, 24], // Tech Campus
      '00000000-0000-0000-0001-000000000007': [4, 6, 8, 10, 12],  // Riverside
    };
    const weeks = stageWeeks[projectId] || [4, 6, 8, 10, 12];
    
    return DEMO_STAGES.map((stage, idx) => ({
      stage_name: stage.name,
      contracted_weeks: weeks[idx] || 4 + idx * 2,
      is_applicable: true
    }));
  };

  // Fetch project stages with contracted weeks
  const { data: projectStagesData } = useQuery({
    queryKey: ['project-stages', project.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return generateDemoProjectStages(project.id);
      }
      const { data, error } = await supabase
        .from('project_stages')
        .select('stage_name, contracted_weeks, is_applicable')
        .eq('project_id', project.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!project.id
  });

  // Build stage info map
  const stageInfoMap = useMemo(() => {
    const map: Record<string, { color: string; orderIndex: number; code?: string }> = {};
    officeStages?.forEach(s => {
      map[s.name] = { color: s.color || '#3b82f6', orderIndex: s.order_index, code: s.code || undefined };
    });
    return map;
  }, [officeStages]);

  // Get stages with colors and contracted weeks
  const stagesWithData = useMemo(() => {
    if (!project.stages || project.stages.length === 0) return [];

    return project.stages
      .map(stageName => {
        const info = stageInfoMap[stageName] || { color: '#6b7280', orderIndex: 999 };
        const stageData = projectStagesData?.find(ps => ps.stage_name === stageName);
        return {
          name: stageName,
          code: info.code,
          color: info.color,
          orderIndex: info.orderIndex,
          contractedWeeks: stageData?.contracted_weeks || 0
        };
      })
      .sort((a, b) => a.orderIndex - b.orderIndex);
  }, [project.stages, stageInfoMap, projectStagesData]);

  const totalContractedWeeks = useMemo(() => {
    return stagesWithData.reduce((sum, s) => sum + s.contractedWeeks, 0);
  }, [stagesWithData]);

  // Generate demo team composition data
  const generateDemoTeamComposition = (projectId: string) => {
    const compositions: { planned_quantity: number; total_planned_hours: number }[] = [];
    const fteByProject: Record<string, number[]> = {
      '00000000-0000-0000-0001-000000000001': [1, 2, 3, 2, 1], // Skyline Tower: Principal, SA x2, PA x3, Arch x2, GA
      '00000000-0000-0000-0001-000000000002': [1, 1, 2, 3, 2], // Harbor View
      '00000000-0000-0000-0001-000000000003': [1, 2, 2, 3, 1], // Metro Health
      '00000000-0000-0000-0001-000000000004': [1, 1, 2, 1, 1], // Urban Park
      '00000000-0000-0000-0001-000000000005': [1, 1, 2, 2, 1], // Boutique Hotel
      '00000000-0000-0000-0001-000000000006': [2, 3, 4, 3, 2], // Tech Campus
      '00000000-0000-0000-0001-000000000007': [1, 2, 2, 2, 1], // Riverside
    };
    const fteData = fteByProject[projectId] || [1, 1, 2, 2, 1];
    
    DEMO_STAGES.forEach((stage, idx) => {
      const fte = fteData[idx] || 1;
      compositions.push({
        planned_quantity: fte,
        total_planned_hours: fte * 160 // ~4 weeks worth of hours
      });
    });
    
    return compositions;
  };

  // Fetch team composition for FTE calculation
  const { data: teamCompositionData } = useQuery({
    queryKey: ['project-team-composition-totals', project.id, isDemoMode],
    queryFn: async () => {
      if (isDemoMode) {
        return generateDemoTeamComposition(project.id);
      }
      const { data, error } = await supabase
        .from('project_stage_team_composition')
        .select('planned_quantity, total_planned_hours')
        .eq('project_id', project.id);
      if (error) throw error;
      return data || [];
    },
    enabled: !!project.id
  });

  const totalFTE = useMemo(() => {
    if (!teamCompositionData) return 0;
    return teamCompositionData.reduce((sum, t) => sum + (t.planned_quantity || 0), 0);
  }, [teamCompositionData]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'on hold': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'planning': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleStageDialogSuccess = () => {
    onUpdate?.();
  };

  return (
    <>
      <Card className="overflow-hidden">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors py-4">
              <div className="flex items-center justify-between gap-4 w-full">
                <div className="flex items-center gap-3 min-w-0">
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <CardTitle className="text-base font-medium truncate">
                      {getProjectDisplayName(project, projectDisplayPreference)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{getProjectSecondaryText(project, projectDisplayPreference)}</p>
                  </div>
                </div>
                
                
                <div className="flex items-center gap-3 ml-auto">
                  {/* Timeline Bar - Fixed Width, Clickable */}
                  <div 
                    className="w-[320px] flex-shrink-0 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(!isOpen);
                    }}
                  >
                    {stagesWithData.length > 0 ? (
                      <TooltipProvider>
                        <div className="flex h-7 rounded-md overflow-hidden bg-muted/30 border hover:ring-2 hover:ring-primary/30 transition-all">
                          {stagesWithData.map((stage) => {
                            const widthPercent = totalContractedWeeks > 0 
                              ? (stage.contractedWeeks / totalContractedWeeks) * 100 
                              : 100 / stagesWithData.length;
                            
                            return (
                              <Tooltip key={stage.name}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="flex items-center justify-center text-xs font-medium text-white truncate px-1 transition-all hover:opacity-80"
                                    style={{ 
                                      backgroundColor: stage.color,
                                      width: `${widthPercent}%`,
                                      minWidth: '24px'
                                    }}
                                  >
                                    {stage.contractedWeeks > 0 && (
                                      <span className="truncate text-[10px]">
                                        {stage.code || stage.name.substring(0, 2)} · {stage.contractedWeeks}w
                                      </span>
                                    )}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent side="top">
                                  <p className="font-medium">{stage.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {stage.contractedWeeks} contracted weeks
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      </TooltipProvider>
                    ) : (
                      <div className="h-7 rounded-md bg-muted/30 border flex items-center justify-center hover:ring-2 hover:ring-primary/30 transition-all">
                        <span className="text-xs text-muted-foreground">No stages</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Calendar className="h-3 w-3" />
                      {totalContractedWeeks}w
                    </Badge>
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      {totalFTE} FTE
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="border-t pt-4">
              {stages.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Plan team composition and contracted weeks for each stage
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowStageDialog(true);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                      Manage Stages
                    </Button>
                  </div>
                  <StageTeamCompositionEditor
                    projectId={project.id}
                    stages={stages}
                    showBudget={showBudget}
                    onStageUpdate={onUpdate}
                  />
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CalendarDays className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                  <h4 className="text-base font-medium mb-1">No stages assigned</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add stages to start planning resources for this project
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="gap-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowStageDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    Add Stages
                  </Button>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <AddProjectStageDialog
        open={showStageDialog}
        onOpenChange={setShowStageDialog}
        projectId={project.id}
        projectName={project.name}
        currentStages={project.stages || []}
        availableStages={availableStages}
        onSuccess={handleStageDialogSuccess}
      />
    </>
  );
};
