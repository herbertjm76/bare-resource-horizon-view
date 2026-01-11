
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
import { useAppSettings } from '@/hooks/useAppSettings';
import { getAllocationCapacity } from '@/utils/allocationCapacity';

interface EnhancedMemberTableRowProps {
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
}

export const EnhancedMemberTableRow: React.FC<EnhancedMemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange,
  projects
}) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  
  // Get member's weekly capacity using consistent allocation capacity logic
  const weeklyCapacity = getAllocationCapacity({
    displayPreference,
    workWeekHours,
    memberWeeklyCapacity: member.weekly_capacity,
  });
  
  // Calculate utilization based on member's specific capacity
  const utilization = calculateUtilization(allocation.resourcedHours, weeklyCapacity);
  
  // Get utilization color
  const getUtilizationColor = (util: number): string => {
    if (util < 50) return 'bg-red-100 text-red-800 border-red-200';
    if (util < 75) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (util < 90) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const utilizationColorClass = getUtilizationColor(utilization);
  
  // Project allocations map for quick lookup
  const projectAllocationsMap = (allocation.projectAllocations || []).reduce((acc, curr) => {
    acc[curr.projectId] = curr.hours;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <TableRow className={`member-row ${isEven ? "bg-muted/10" : ""}`}>
      <TableCell className="py-2 px-4 name-column">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">
            {member.first_name} {member.last_name}
            {member.isPending && <span className="text-muted-foreground text-xs ml-1">(pending)</span>}
          </span>
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full h-full flex items-center justify-center">
                <span className="enhanced-project-pill">{allocation.projects.length}</span>
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
      
      <TableCell className="py-1 px-1 capacity-column">
        <div className="enhanced-capacity-display">
          {formatNumber(allocation.resourcedHours || 0)}h
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className={`enhanced-utilization-pill border ${utilizationColorClass}`}>
          {formatNumber(utilization)}%
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column leave-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.annualLeave}
            onChange={(e) => onInputChange(member.id, 'annualLeave', e.target.value)}
            className="enhanced-leave-input"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column">
        <div className="table-cell font-medium text-foreground">{allocation.publicHoliday}</div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column leave-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.vacationLeave}
            onChange={(e) => onInputChange(member.id, 'vacationLeave', e.target.value)}
            className="enhanced-leave-input"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column leave-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.medicalLeave}
            onChange={(e) => onInputChange(member.id, 'medicalLeave', e.target.value)}
            className="enhanced-leave-input"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-1 number-column leave-column">
        <div className="table-cell">
          <input
            type="number"
            min="0"
            value={allocation.others}
            onChange={(e) => onInputChange(member.id, 'others', e.target.value)}
            className="enhanced-leave-input"
          />
        </div>
      </TableCell>
      
      <TableCell className="py-1 px-4 remarks-column">
        <Textarea 
          value={allocation.remarks}
          onChange={(e) => onInputChange(member.id, 'remarks', e.target.value)}
          className="enhanced-remarks-textarea min-h-0 h-6 p-1 text-xs resize-none"
        />
      </TableCell>
      
      {/* Enhanced Project allocation cells */}
      {projects.map(project => (
        <TableCell key={project.id} className="py-1 px-1 project-hours-column">
          <div className="table-cell text-center">
            {projectAllocationsMap[project.id] ? (
              <span className="font-medium text-foreground">
                {formatNumber(projectAllocationsMap[project.id])}h
              </span>
            ) : ''}
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
};
