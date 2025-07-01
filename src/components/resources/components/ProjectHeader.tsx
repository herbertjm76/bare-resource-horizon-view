
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      
      {/* Project name column */}
      <td className={`project-name-column ${headerBgClass} p-2`}>
        <div className="flex items-center justify-between">
          <div className="truncate-text">
            <div className="font-medium text-white text-sm">
              {project.name}
            </div>
            <div className="text-xs text-white/80">
              {resourceCount} resource{resourceCount !== 1 ? 's' : ''}
              {totalHours > 0 && (
                <span className="ml-2">
                  • {totalHours}h total
                </span>
              )}
            </div>
          </div>
        </div>
      </td>
    </>
  );
};
