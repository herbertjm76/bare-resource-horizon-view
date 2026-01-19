import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAppSettings } from '@/hooks/useAppSettings';
import { getProjectAbbreviation, getProjectTooltip } from '@/utils/projectDisplay';
import { formatAllocationValue } from '@/utils/allocationDisplay';

interface ProjectAllocation {
  projectId: string;
  projectName: string;
  projectCode: string;
  hours: number;
}

interface LeaveAllocation {
  type: 'leave' | 'holiday';
  hours: number;
  label?: string;
}

interface MemberAvailabilityCardProps {
  avatarUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  allocatedHours: number;
  projectAllocations: ProjectAllocation[];
  leaveAllocations?: LeaveAllocation[];
  utilization: number;
  threshold?: number;
  memberId: string;
  memberType: 'active' | 'pre_registered';
  weekStartDate: string;
  disableDialog?: boolean;
  capacity?: number;
}

export const MemberAvailabilityCard: React.FC<MemberAvailabilityCardProps> = React.memo(({
  avatarUrl,
  firstName,
  lastName,
  allocatedHours,
  projectAllocations,
  leaveAllocations = [],
  utilization,
  threshold = 80,
  memberId,
  memberType,
  weekStartDate,
  disableDialog = false,
  capacity = 40,
}) => {
  const { displayPreference, workWeekHours } = useAppSettings();
  const effectiveCapacity = capacity || workWeekHours;
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Unknown';
  const initials = [firstName?.[0], lastName?.[0]].filter(Boolean).join('').toUpperCase() || 'U';
  
  // Calculate leave and holiday hours
  const leaveHours = leaveAllocations
    .filter(l => l.type === 'leave')
    .reduce((sum, l) => sum + l.hours, 0);
  const holidayHours = leaveAllocations
    .filter(l => l.type === 'holiday')
    .reduce((sum, l) => sum + l.hours, 0);
  const projectHours = projectAllocations.reduce((sum, p) => sum + p.hours, 0);
  
  // Calculate progress for the ring based on utilization percentage
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(utilization, 100) / 100) * circumference;
  
  // Color-coding based on utilization percentage
  const getUtilizationColor = () => {
    if (utilization > 100) return 'hsl(0, 84%, 60%)'; // Red - over-allocated
    if (utilization >= 80) return 'hsl(142, 71%, 45%)'; // Green - optimal (80-100%)
    if (utilization >= 50) return 'hsl(48, 96%, 53%)'; // Yellow - moderate (50-79%)
    if (utilization > 0) return 'hsl(25, 95%, 53%)'; // Orange - underutilized (<50%)
    return 'hsl(220, 9%, 46%)'; // Gray - no allocation
  };

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="flex flex-col items-center transition-all duration-200 hover:scale-105 cursor-pointer"
          >
            {/* Avatar with utilization ring */}
            <div className="relative w-[50px] h-[50px] flex items-center justify-center">
              {/* Full light grey background circle */}
              <svg className="absolute inset-0 -rotate-90" width="50" height="50">
                <circle
                  cx="25"
                  cy="25"
                  r={20}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth="5"
                />
                {/* Color-coded utilization ring */}
                <circle
                  cx="25"
                  cy="25"
                  r={20}
                  fill="none"
                  stroke={getUtilizationColor()}
                  strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <Avatar className="h-[38px] w-[38px]">
                <AvatarImage src={avatarUrl || ''} alt={fullName} />
                <AvatarFallback className="text-xs font-medium">{initials}</AvatarFallback>
              </Avatar>
            </div>
            
            {/* First name */}
            <span className="text-[11px] font-medium text-foreground truncate max-w-[55px] -mt-1">
              {firstName}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="p-3 max-w-[220px]">
          <div className="space-y-2">
            <div className="font-semibold text-sm text-foreground">{fullName}</div>
            <div className="text-xs text-muted-foreground">
              {Math.round(utilization)}% utilized • {formatAllocationValue(allocatedHours, effectiveCapacity, displayPreference)} allocated
            </div>
            
            {/* Breakdown section */}
            <div className="space-y-1.5 pt-1 border-t border-border">
              {/* Project Hours */}
              {projectHours > 0 && (
                <>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-600 font-medium">Projects:</span>
                    <span className="text-muted-foreground font-medium">{formatAllocationValue(projectHours, effectiveCapacity, displayPreference)}</span>
                  </div>
                  {projectAllocations.map((project) => (
                    <div key={project.projectId} className="flex justify-between items-center text-xs pl-2">
                      <span 
                        className="text-foreground truncate max-w-[130px]"
                        title={getProjectTooltip({ code: project.projectCode, name: project.projectName })}
                      >
                        {getProjectAbbreviation({ code: project.projectCode, name: project.projectName })}
                      </span>
                      <span className="text-muted-foreground ml-2">{formatAllocationValue(project.hours, effectiveCapacity, displayPreference)}</span>
                    </div>
                  ))}
                </>
              )}
              
              {/* Leave Hours */}
              {leaveHours > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-green-600 font-medium">Leave:</span>
                  <span className="text-muted-foreground font-medium">{formatAllocationValue(leaveHours, effectiveCapacity, displayPreference)}</span>
                </div>
              )}
              
              {/* Holiday Hours */}
              {holidayHours > 0 && (
                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-600 font-medium">Holidays:</span>
                  <span className="text-muted-foreground font-medium">{formatAllocationValue(holidayHours, effectiveCapacity, displayPreference)}</span>
                </div>
              )}
              
              {/* No allocations message */}
              {projectHours === 0 && leaveHours === 0 && holidayHours === 0 && (
                <div className="text-xs text-muted-foreground italic">
                  No projects assigned this week
                </div>
              )}
            </div>
            
            <div className="text-[10px] text-muted-foreground pt-1 border-t border-border">
              Click to add hours or leave
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

MemberAvailabilityCard.displayName = 'MemberAvailabilityCard';
