
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StageSelector } from './StageSelector';
import { StageProgressBar } from './StageProgressBar';
import { useProjectStageProgress } from '@/hooks/useProjectStageProgress';
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectDisplayName } from '@/utils/projectDisplay';

interface ProjectHeaderProps {
  project: any;
  resourceCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  headerBgClass: string;
  totalHours?: number;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  resourceCount,
  isExpanded,
  onToggleExpand,
  headerBgClass,
  totalHours = 0
}) => {
  const { projectDisplayPreference } = useAppSettings();
  const [currentStage, setCurrentStage] = useState(project.current_stage || (project.stages?.[0] || ''));
  
  const { stageProgress, isLoading } = useProjectStageProgress(project.id, currentStage);

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
  };

  return (
    <>
      {/* Counter column */}
      <td
        className={`counter-column ${headerBgClass} p-1 text-center cursor-pointer`}
        onClick={onToggleExpand}
        role="button"
        aria-label={isExpanded ? 'Collapse project' : 'Expand project'}
      >
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-foreground hover:bg-muted"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-3 w-3" />
          ) : (
            <ChevronRight className="h-3 w-3" />
          )}
        </Button>
      </td>
      
      {/* Project name column with stage controls */}
      <td className={`project-name-column ${headerBgClass} p-2`}>
        <div className="flex items-center justify-between gap-2">
          <div className="truncate-text flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="font-medium text-foreground text-sm truncate">
                {getProjectDisplayName(project, projectDisplayPreference)}
              </div>
              <StageSelector
                projectId={project.id}
                currentStage={currentStage}
                availableStages={project.stages || []}
                onStageChange={handleStageChange}
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-muted-foreground">
                {resourceCount} resource{resourceCount !== 1 ? 's' : ''}
                {totalHours > 0 && (
                  <span className="ml-2">
                    • {totalHours}h total
                  </span>
                )}
              </div>
              
              {/* Stage progress bar */}
              {!isLoading && stageProgress.totalBudgetedHours > 0 && (
                <div className="flex-1 max-w-32">
                  <StageProgressBar
                    allocatedHours={stageProgress.totalAllocatedHours}
                    budgetedHours={stageProgress.totalBudgetedHours}
                    progressPercentage={stageProgress.progressPercentage}
                    isOverAllocated={stageProgress.isOverAllocated}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </td>
    </>
  );
};
