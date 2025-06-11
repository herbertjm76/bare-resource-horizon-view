
import React from 'react';
import { ChevronDown, ChevronRight, Users, Clock, DollarSign } from 'lucide-react';
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

  return (
    <>
      {/* Fixed counter column */}
      <td className={`sticky-left-0 ${headerBgClass} z-10 p-1 w-12 text-center`}>
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
        className={`sticky-left-12 ${headerBgClass} z-10 p-1 font-medium`}
        style={{ width: '200px', minWidth: '200px' }}
      >
        <div className="flex flex-col">
          <div className="text-sm font-bold line-clamp-1 mb-0.5">{project.name || 'Untitled Project'}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              <span>{resourceCount}</span>
            </div>
            
            {totalHours > 0 && (
              <div className="flex items-center gap-0.5 bg-white/80 rounded px-1 py-0.5 min-w-0 shrink-0">
                <Clock className="h-2.5 w-2.5 flex-shrink-0" />
                <span className="text-[9px] font-medium leading-none whitespace-nowrap">{totalHours}h</span>
              </div>
            )}
            
            {hasFeesSet ? (
              <ResourceUtilizationBadge utilization={75} size="xs" />
            ) : (
              <div className="flex items-center gap-0.5">
                <DollarSign className="h-3 w-3" />
                <span className="text-[10px]">Not set</span>
              </div>
            )}
          </div>
        </div>
      </td>
    </>
  );
};
