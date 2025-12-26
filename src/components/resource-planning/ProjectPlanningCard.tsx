import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Clock, Users, CalendarDays, DollarSign, Plus, Settings } from 'lucide-react';
import { StageTeamCompositionEditor } from '@/components/projects/team-composition/StageTeamCompositionEditor';
import { AddProjectStageDialog } from './AddProjectStageDialog';

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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <CardTitle className="text-base font-medium">
                      {project.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{project.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {stages.length} {stages.length === 1 ? 'stage' : 'stages'}
                  </Badge>
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
