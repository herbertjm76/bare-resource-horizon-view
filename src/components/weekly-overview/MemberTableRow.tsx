
import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { formatNumber, calculateUtilization, calculateCapacity } from './utils';

interface MemberAllocation {
  id: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  remarks: string;
  projects: string[];
  resourcedHours: number;
  projectAllocations?: Array<{
    projectName: string;
    hours: number;
  }>;
}

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
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange
}) => {
  // Get member's weekly capacity (default to 40 if not set)
  const weeklyCapacity = member.weekly_capacity || 40;
  
  // Calculate utilization based on member's specific capacity
  const utilization = calculateUtilization(allocation.resourcedHours, weeklyCapacity);
  
  // Default project allocations if not provided
  const projectAllocations = allocation.projectAllocations || 
    allocation.projects.map((name, index) => ({
      projectName: name,
      hours: Math.round((allocation.resourcedHours / allocation.projects.length) * 10) / 10
    }));
  
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
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full h-full flex items-center justify-center">
                <span className="project-pill">{allocation.projects.length}</span>
              </TooltipTrigger>
              <TooltipContent side="right" className="w-64">
                <div className="p-1">
                  <strong>Projects:</strong>
                  {allocation.projects.length > 0 ? (
                    <ul className="list-disc ml-4 mt-1">
                      {allocation.projects.map((project, idx) => (
                        <li key={idx}>{project}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-muted-foreground">No projects assigned</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 text-center number-column font-bold">
        <div className="table-cell">{formatNumber(allocation.resourcedHours || 0)}</div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">{formatNumber(utilization)}%</div>
      </TableCell>
      
      <TableCell className="py-1 px-1 bg-yellow-100 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.annualLeave}
            onChange={(e) => onInputChange(member.id, 'annualLeave', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">{allocation.publicHoliday}</div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.vacationLeave}
            onChange={(e) => onInputChange(member.id, 'vacationLeave', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.medicalLeave}
            onChange={(e) => onInputChange(member.id, 'medicalLeave', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.others}
            onChange={(e) => onInputChange(member.id, 'others', e.target.value)}
            className="editable-cell"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-4 remarks-column">
        <Textarea 
          value={allocation.remarks}
          onChange={(e) => onInputChange(member.id, 'remarks', e.target.value)}
          className="min-h-0 h-6 p-1 text-xs resize-none"
        />
      </TableCell>
      
      <TableCell className="py-1 px-4 projects-column">
        <div className="flex flex-col gap-1 text-xs">
          {projectAllocations.length > 0 ? (
            projectAllocations.map((project, idx) => (
              <div key={idx} className="flex justify-between items-center py-0.5">
                <span className="font-medium truncate max-w-[120px]" title={project.projectName}>
                  {project.projectName}
                </span>
                <span className="ml-2 bg-muted/60 px-2 py-0.5 rounded font-mono">
                  {formatNumber(project.hours)}h
                </span>
              </div>
            ))
          ) : (
            <span className="text-muted-foreground italic">No projects assigned</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
