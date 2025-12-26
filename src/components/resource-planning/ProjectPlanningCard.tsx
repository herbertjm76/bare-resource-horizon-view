import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, Clock, Users, CalendarDays, DollarSign } from 'lucide-react';
import { StageTeamCompositionEditor } from '@/components/projects/team-composition/StageTeamCompositionEditor';

interface ProjectStage {
  id: string;
  name: string;
  code?: string;
  contractedWeeks?: number;
}

interface ProjectPlanningCardProps {
  project: {
    id: string;
    name: string;
    code: string;
    status: string;
    current_stage?: string;
  };
  stages: ProjectStage[];
  showBudget?: boolean;
  onUpdate?: () => void;
}

export const ProjectPlanningCard: React.FC<ProjectPlanningCardProps> = ({
  project,
  stages,
  showBudget = false,
  onUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'on hold': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
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
                  {stages.length} stages
                </Badge>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="border-t pt-4">
            {stages.length > 0 ? (
              <StageTeamCompositionEditor
                projectId={project.id}
                stages={stages}
                showBudget={showBudget}
                onStageUpdate={onUpdate}
              />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No stages defined for this project.</p>
                <p className="text-sm">Add stages in the project settings.</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
