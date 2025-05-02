
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { ResourceUtilizationBadge } from './ResourceUtilizationBadge';

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
                <ResourceUtilizationBadge utilization={75} size="sm" />
                <span className="ml-1 text-xs text-muted-foreground">{totalHours}h</span>
              </div>
            )}
          </div>
        </div>
      </td>
    </>
  );
};
