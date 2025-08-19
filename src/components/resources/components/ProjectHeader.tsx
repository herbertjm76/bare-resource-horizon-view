
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StageSelector } from './StageSelector';
import { StageProgressBar } from './StageProgressBar';
import { useProjectStageProgress } from '@/hooks/useProjectStageProgress';

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
  const [currentStage, setCurrentStage] = useState(project.current_stage || (project.stages?.[0] || ''));
  
  const { stageProgress, isLoading } = useProjectStageProgress(project.id, currentStage);

  const handleStageChange = (newStage: string) => {
    setCurrentStage(newStage);
  };

  return (
    <>
      {/* Counter column */}
      <td className={`counter-column ${headerBgClass} p-1 text-center`}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-white hover:bg-white/20"
          onClick={onToggleExpand}
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
              <div className="font-medium text-white text-sm truncate">
                {project.name}
              </div>
              <StageSelector
                projectId={project.id}
                currentStage={currentStage}
                availableStages={project.stages || []}
                onStageChange={handleStageChange}
              />
            </div>
            
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs text-white/80">
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
