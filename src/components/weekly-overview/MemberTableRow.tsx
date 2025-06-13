import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Project, MemberAllocation } from './types';
import { CapacityBar } from '@/components/week-resourcing/CapacityBar';

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
  const weeklyCapacity = member.weekly_capacity || 40;
  const totalWeeklyAllocatedHours = getMemberTotal ? getMemberTotal(member.id) : 
    (allocation.projectAllocations?.reduce((sum, proj) => sum + proj.hours, 0) || 0);
  const projectCount = getProjectCount ? getProjectCount(member.id) : 
    (allocation.projectAllocations?.filter(proj => proj.hours > 0).length || 0);
  
  // Calculate capacity utilization
  const annualLeave = allocation.annualLeave || 0;
  const holidayHours = allocation.holiday || 0;
  const otherLeave = allocation.other || 0;
  const totalUsedHours = totalWeeklyAllocatedHours + annualLeave + holidayHours + otherLeave;
  const availableHours = Math.max(0, weeklyCapacity - totalUsedHours);

  console.log(`MemberTableRow - Member ${member.first_name} ${member.last_name}:`, {
    totalWeeklyAllocatedHours,
    projectCount,
    weeklyCapacity,
    totalUsedHours,
    availableHours,
    usingComprehensiveData: !!getMemberTotal
  });

  return (
    <TableRow className={`${isEven ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-100/50`}>
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
            <span className="text-xs font-medium text-gray-900">{getMemberDisplayName(member)}</span>
            <span className="text-xs text-gray-500">{getOfficeDisplay(member.location || 'unknown')}</span>
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

      {/* Holiday */}
      <TableCell className="text-center py-2 px-1">
        <Input
          type="number"
          value={allocation.holiday || ''}
          onChange={(e) => onInputChange(member.id, 'holiday', Number(e.target.value) || 0)}
          className="w-12 h-7 text-center text-xs p-1"
          min="0"
          step="0.5"
        />
      </TableCell>

      {/* Other Leave */}
      <TableCell className="text-center py-2 px-1">
        <Input
          type="number"
          value={allocation.other || ''}
          onChange={(e) => onInputChange(member.id, 'other', Number(e.target.value) || 0)}
          className="w-12 h-7 text-center text-xs p-1"
          min="0"
          step="0.5"
        />
      </TableCell>

      {/* Capacity Bar */}
      <TableCell className="text-center py-2 px-2">
        <div className="text-xs">
          <span className="font-medium">{availableHours}h</span>
          <span className="text-gray-500 ml-1">avail</span>
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
                  updatedProjectAllocations.push({ projectId: project.id, hours: newHours });
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
