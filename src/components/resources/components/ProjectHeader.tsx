
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
    <td 
      className={`sticky-left-0 ${headerBgClass} z-10 p-3 font-medium`}
      style={{
        width: '250px',
        minWidth: '250px',
        maxWidth: '250px'
      }}
    >
      <div className="flex items-center gap-2">
        <button 
          onClick={onToggleExpand} 
          className="rounded-full p-1 hover:bg-white/30 transition-colors flex-shrink-0"
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-foreground/80" />
          ) : (
            <ChevronRight className="h-4 w-4 text-foreground/80" />
          )}
        </button>
        
        <div className="flex flex-col min-w-0 flex-1">
          <div className="text-sm font-medium line-clamp-1 mb-0.5">{project.name || 'Untitled Project'}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              <span>{resourceCount}</span>
            </div>
            
            {totalHours > 0 && (
              <div className="flex items-center gap-0.5 bg-white/80 rounded-full px-2.5 py-0.5">
                <Clock className="h-3 w-3" />
                <span className="font-medium text-sm">{totalHours}h</span>
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
      </div>
    </td>
  );
};
