
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { formatNumber, calculateUtilization } from './utils';
import { MemberAllocation, Project } from './types';

interface MemberTableRowProps {
  member: {
    id: string;
    first_name: string;
    last_name: string;
    location: string | null;
    isPending?: boolean;
    weekly_capacity?: number;
  };
  allocation: MemberAllocation;
  isEven: boolean;
  getOfficeDisplay: (locationCode: string) => string;
  onInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
  selectedWeek: Date;
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange,
  projects,
  selectedWeek
}) => {
  // Get member's weekly capacity (default to 40 if not set)
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Calculate utilization based on member's specific capacity
  const utilization = calculateUtilization(allocation.resourcedHours, weeklyCapacity);
  
  // Project allocations map for quick lookup
  const projectAllocationsMap = (allocation.projectAllocations || []).reduce((acc, curr) => {
    acc[curr.projectId] = curr.hours;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <TableRow className={isEven ? "bg-muted/10" : ""}>
      <TableCell className="py-1 px-4 name-column">
        <div className="flex items-center gap-2">
          <span>
            {member.first_name} {member.last_name}
            {member.isPending && <span className="text-muted-foreground text-xs ml-1">(pending)</span>}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-4 office-column">
        <div className="flex items-center justify-center">
          {getOfficeDisplay(member.location || 'N/A')}
        </div>
      </TableCell>
      
      {/* Project columns - each project in the company gets its own column */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-1 px-1 project-hours-column">
          <div className="table-cell text-center">
            {projectAllocationsMap[project.id] ? (
              <span className="font-medium">{formatNumber(projectAllocationsMap[project.id])}</span>
            ) : (
              <span className="text-gray-300">0</span>
            )}
          </div>
        </TableCell>
      ))}
      
      {/* Weekly total column */}
      <TableCell className="py-1 px-1 text-center number-column font-bold">
        <div className="table-cell">{formatNumber(allocation.resourcedHours || 0)}</div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">{formatNumber(utilization)}%</div>
      </TableCell>
    </TableRow>
  );
};
