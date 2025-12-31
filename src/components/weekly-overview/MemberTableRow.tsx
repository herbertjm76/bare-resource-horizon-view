
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Project, MemberAllocation } from './types';
import { CapacityBar } from '@/components/week-resourcing/CapacityBar';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAvailableValue } from '@/utils/allocationDisplay';
import { logger } from '@/utils/logger';

interface MemberTableRowProps {
  member: any;
  allocation: MemberAllocation;
  isEven: boolean;
  getOfficeDisplay: (locationCode: string) => string;
  onInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
  // New comprehensive functions
  getMemberTotal?: (memberId: string) => number;
  getProjectCount?: (memberId: string) => number;
  allocationMap?: Map<string, number>;
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange,
  projects,
  getMemberTotal,
  getProjectCount,
  allocationMap
}) => {
  const { workWeekHours, displayPreference } = useAppSettings();
  // Helper to get user initials
  const getUserInitials = (member: any): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: any): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  // Use comprehensive data if available, otherwise fall back to legacy allocation
  const weeklyCapacity = member.weekly_capacity || workWeekHours;
  const totalWeeklyAllocatedHours = getMemberTotal ? getMemberTotal(member.id) : 
    (allocation.projectAllocations?.reduce((sum, proj) => sum + proj.hours, 0) || 0);
  const projectCount = getProjectCount ? getProjectCount(member.id) : 
    (allocation.projectAllocations?.filter(proj => proj.hours > 0).length || 0);
  
  // Calculate capacity utilization - use the correct property names from MemberAllocation
  const annualLeave = allocation.annualLeave || 0;
  const publicHolidayHours = allocation.publicHoliday || 0; // Use publicHoliday instead of holiday
  const otherLeave = allocation.others || 0; // Use others instead of other
  const totalUsedHours = totalWeeklyAllocatedHours + annualLeave + publicHolidayHours + otherLeave;
  const availableHours = weeklyCapacity - totalUsedHours; // Remove Math.max(0, ...) to allow negative values

  logger.debug(`MemberTableRow - Member ${member.first_name} ${member.last_name}:`, {
    totalWeeklyAllocatedHours,
    projectCount,
    weeklyCapacity,
    totalUsedHours,
    availableHours,
    usingComprehensiveData: !!getMemberTotal
  });

  return (
    <TableRow className={`${isEven ? 'bg-background' : 'bg-muted/50'} hover:bg-muted/70`}>
      {/* Member Name */}
      <TableCell className="py-2 px-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={getAvatarUrl(member)} />
            <AvatarFallback className="text-xs bg-blue-100">
              {getUserInitials(member)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-foreground">{getMemberDisplayName(member)}</span>
            <span className="text-xs text-muted-foreground">{getOfficeDisplay(member.location || 'unknown')}</span>
          </div>
        </div>
      </TableCell>

      {/* Project Count */}
      <TableCell className="text-center py-2 px-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {projectCount}
        </span>
      </TableCell>

      {/* Capacity */}
      <TableCell className="text-center py-2 px-2">
        <CapacityBar 
          totalUsedHours={totalUsedHours} 
          totalCapacity={weeklyCapacity} 
        />
      </TableCell>

      {/* Annual Leave */}
      <TableCell className="text-center py-2 px-1">
        <Input
          type="number"
          value={allocation.annualLeave || ''}
          onChange={(e) => onInputChange(member.id, 'annualLeave', Number(e.target.value) || 0)}
          className="w-12 h-7 text-center text-xs p-1"
          min="0"
          step="0.5"
        />
      </TableCell>

      {/* Holiday - use publicHoliday property */}
      <TableCell className="text-center py-2 px-1">
        <Input
          type="number"
          value={allocation.publicHoliday || ''}
          onChange={(e) => onInputChange(member.id, 'publicHoliday', Number(e.target.value) || 0)}
          className="w-12 h-7 text-center text-xs p-1"
          min="0"
          step="0.5"
        />
      </TableCell>

      {/* Other Leave - use others property */}
      <TableCell className="text-center py-2 px-1">
        <Input
          type="number"
          value={allocation.others || ''}
          onChange={(e) => onInputChange(member.id, 'others', Number(e.target.value) || 0)}
          className="w-12 h-7 text-center text-xs p-1"
          min="0"
          step="0.5"
        />
      </TableCell>

      {/* Capacity Bar */}
      <TableCell className="text-center py-2 px-2">
        <div className="text-xs">
          <span className={`font-medium ${availableHours < 0 ? 'text-red-600 font-bold' : ''}`}>
            {formatAvailableValue(availableHours, weeklyCapacity, displayPreference)}
          </span>
          <span className="text-muted-foreground ml-1">avail</span>
        </div>
      </TableCell>

      {/* Project Allocation Cells */}
      {projects.map((project) => {
        let hours = 0;
        
        // Use comprehensive allocation map if available
        if (allocationMap) {
          const key = `${member.id}:${project.id}`;
          hours = allocationMap.get(key) || 0;
        } else {
          // Fallback to legacy allocation
          const projectAllocation = allocation.projectAllocations?.find(p => p.projectId === project.id);
          hours = projectAllocation?.hours || 0;
        }

        return (
          <TableCell key={project.id} className="text-center py-2 px-1">
            <Input
              type="number"
              value={hours > 0 ? hours : ''}
              onChange={(e) => {
                const newHours = Number(e.target.value) || 0;
                // Update using legacy system for now
                const existingProjectAllocations = allocation.projectAllocations || [];
                const updatedProjectAllocations = existingProjectAllocations.filter(p => p.projectId !== project.id);
                if (newHours > 0) {
                  // Create a complete ProjectAllocation object with all required properties
                  updatedProjectAllocations.push({ 
                    projectId: project.id, 
                    hours: newHours,
                    projectName: project.name,
                    projectCode: project.code
                  });
                }
                onInputChange(member.id, 'projectAllocations', updatedProjectAllocations);
              }}
              className="w-12 h-7 text-center text-xs p-1"
              min="0"
              step="0.5"
              placeholder="0"
            />
          </TableCell>
        );
      })}

      {/* Remarks */}
      <TableCell className="py-2 px-2">
        <Input
          type="text"
          value={allocation.remarks || ''}
          onChange={(e) => onInputChange(member.id, 'remarks', e.target.value)}
          className="w-full h-7 text-xs p-1"
          placeholder="Notes..."
        />
      </TableCell>
    </TableRow>
  );
};
