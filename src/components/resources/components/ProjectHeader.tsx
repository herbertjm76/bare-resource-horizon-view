
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
        <div className="flex items-center">
          <div className="text-sm font-medium line-clamp-1 mr-2">{project.name || 'Untitled Project'}</div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{resourceCount} resource{resourceCount !== 1 ? 's' : ''}</span>
            
            {totalHours > 0 && (
              <>
                <span className="mx-0.5 text-muted-foreground">•</span>
                {hasFeesSet ? (
                  <div className="flex items-center gap-1">
                    <ResourceUtilizationBadge utilization={projectUtilization} size="sm" />
                    <span>{totalHours}h</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <NoFeeBadge hours={totalHours} size="sm" />
                    <span>{totalHours}h</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </td>
    </>
  );
};
