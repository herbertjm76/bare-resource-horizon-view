
import React from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProjectHeaderProps {
  project: any;
  resourceCount: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  headerBgClass: string;
  weeklyProjectHours?: Record<string, number>;
  weeks?: { startDate: Date; label: string; }[];
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  resourceCount,
  isExpanded,
  onToggleExpand,
  headerBgClass,
  weeklyProjectHours = {},
  weeks = []
}) => {
  return (
    <>
      {/* Resource count column */}
      <td className={`sticky left-0 z-10 p-2 w-12 text-center ${headerBgClass}`}>
        {/* Counter moved to the project name cell */}
      </td>

      {/* Project name cell with the counter on the right */}
      <td className={`sticky left-12 z-10 p-2 cursor-pointer ${headerBgClass}`} onClick={onToggleExpand}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 mr-2">
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <div>
              <div className="font-medium">{project.name}</div>
              <div className="text-xs text-muted-foreground">{project.code}</div>
            </div>
          </div>
          
          {/* Always show resource counter */}
          <div className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-brand-violet text-white text-xs font-medium">
            {resourceCount}
          </div>
        </div>
      </td>
    </>
  );
};
