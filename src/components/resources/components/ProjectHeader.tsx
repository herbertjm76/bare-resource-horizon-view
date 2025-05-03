
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ResourceUtilizationBadge } from './ResourceUtilizationBadge';
import { NoFeeBadge } from './NoFeeBadge';

interface ProjectHeaderProps {
  project: any;
  resourceCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  headerBgClass: string;
  totalHours?: number; // Optional total hours
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  resourceCount,
  isExpanded,
  onToggleExpand,
  headerBgClass,
  totalHours = 0
}) => {
  // Check if the project has fees set
  const hasFeesSet = project.fee > 0 || (project.stage_fees && project.stage_fees.length > 0);
  
  // Placeholder utilization calculation (this would ideally come from a hook or calculation)
  const projectUtilization = 75; // This would be calculated based on project budget vs hours

  return (
    <>
      {/* Fixed counter column */}
      <td className={`sticky-left-0 ${headerBgClass} z-10 p-2 w-12 text-center`}>
        <button 
          onClick={onToggleExpand} 
          className="rounded-full p-1 hover:bg-white/30 transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-foreground/80" />
          ) : (
            <ChevronRight className="h-4 w-4 text-foreground/80" />
          )}
        </button>
      </td>
      
      {/* Fixed project name column */}
      <td 
        className={`sticky-left-12 ${headerBgClass} z-10 p-2 font-medium`}
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex flex-col">
          <div className="text-sm font-medium line-clamp-1">{project.name || 'Untitled Project'}</div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground">
              {resourceCount} resource{resourceCount !== 1 ? 's' : ''}
            </div>
            {totalHours > 0 && (
              <div className="flex items-center">
                <span className="mx-1 text-muted-foreground">•</span>
                {hasFeesSet ? (
                  <ResourceUtilizationBadge utilization={projectUtilization} size="sm" />
                ) : (
                  <NoFeeBadge hours={totalHours} size="sm" />
                )}
                <span className="ml-1 text-xs text-muted-foreground">{totalHours}h</span>
              </div>
            )}
          </div>
        </div>
      </td>
    </>
  );
};
