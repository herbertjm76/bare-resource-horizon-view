import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectPlanningCard } from './ProjectPlanningCard';
import { FolderOpen } from 'lucide-react';
import { usePinnedItems } from '@/hooks/usePinnedItems';

interface Project {
  id: string;
  name: string;
  code: string;
  status: string;
  current_stage?: string;
  stages?: string[] | null;
}

interface OfficeStage {
  id: string;
  name: string;
  code?: string | null;
}

interface ProjectPlanningListProps {
  projects: Project[];
  officeStages: OfficeStage[];
  isLoading?: boolean;
  showBudget?: boolean;
  onUpdate?: () => void;
}

export const ProjectPlanningList: React.FC<ProjectPlanningListProps> = ({
  projects,
  officeStages,
  isLoading,
  showBudget = false,
  onUpdate
}) => {
  const { pinnedIds, togglePin, sortWithPinnedFirst, isPinned } = usePinnedItems({
    viewContext: 'resource_planning',
    itemType: 'project'
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  // Separate pinned vs non-pinned - pinned always show regardless of empty state
  const pinnedProjects = projects.filter(p => isPinned(p.id));
  const unpinnedProjects = projects.filter(p => !isPinned(p.id));

  // Sort pinned by their display order
  const sortedPinned = sortWithPinnedFirst(pinnedProjects);
  
  // Combine: pinned first, then unpinned
  const sortedProjects = [...sortedPinned, ...unpinnedProjects];

  if (sortedProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No Projects Found</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Create projects and assign stages to start planning your resource allocation.
        </p>
      </div>
    );
  }

  // Map project stages to office stages
  const getProjectStages = (project: Project) => {
    if (!project.stages || !Array.isArray(project.stages)) return [];
    
    return project.stages
      .map(stageName => {
        const officeStage = officeStages.find(os => os.name === stageName);
        if (!officeStage) return null;
        return {
          id: officeStage.id,
          name: officeStage.name,
          code: officeStage.code || undefined
        };
      })
      .filter(Boolean) as { id: string; name: string; code?: string }[];
  };

  return (
    <div className="space-y-4">
      {sortedProjects.map(project => (
        <ProjectPlanningCard
          key={project.id}
          project={project}
          stages={getProjectStages(project)}
          availableStages={officeStages}
          showBudget={showBudget}
          onUpdate={onUpdate}
          isPinned={isPinned(project.id)}
          onTogglePin={togglePin}
        />
      ))}
    </div>
  );
};
