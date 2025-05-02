
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

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
      {/* Resource count column */}
      <td className={`sticky left-0 z-10 p-2 w-12 text-center ${headerBgClass}`}>
        {/* Counter moved to the project name cell */}
      </td>

      {/* Project name cell with the counter on the right */}
      <td className={`sticky left-12 z-10 p-1 cursor-pointer ${headerBgClass}`} onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
            <div className="truncate">
              <div className="font-medium text-xs truncate">{project.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {project.code}
                {totalHours > 0 && (
                  <span className="ml-1 font-medium text-brand-primary text-xs">• {totalHours}h</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-brand-violet text-white text-xs font-medium">
            {resourceCount}
          </div>
        </div>
      </td>
    </>
  );
};
