import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Briefcase, MapPin } from 'lucide-react';
import { ResourceAllocationCell } from './ResourceAllocationCell';
import { CapacityBar } from './CapacityBar';
import { RemarksCell } from './RemarksCell';
import { LeaveTooltip } from './LeaveTooltip';

interface LeaveDay {
  date: string;
  hours: number;
}

interface ResourceTableRowProps {
  member: any;
  projects: any[];
  idx: number;
  weekStartDate: string;
  allocationMap: Map<string, number>;
  projectCount: number;
  manualLeaveData: Record<string, Record<string, number>>;
  remarksData: Record<string, string>;
  leaveDays: LeaveDay[];
  weeklyCapacity: number;
  totalHours: number;
  annualLeave: number;
  onLeaveInputChange: (memberId: string, leaveType: string, value: string) => void;
  onRemarksUpdate: (memberId: string, remarks: string) => void;
}

export const ResourceTableRow: React.FC<ResourceTableRowProps> = ({
  member,
  projects,
  idx,
  weekStartDate,
  allocationMap,
  projectCount,
  manualLeaveData,
  remarksData,
  leaveDays,
  weeklyCapacity,
  totalHours,
  annualLeave,
  onLeaveInputChange,
  onRemarksUpdate
}) => {
  // Get sick and other leave
  const sickLeave = manualLeaveData[member.id]?.['sick'] || 0;
  const otherLeave = manualLeaveData[member.id]?.['other'] || 0;
  const totalLeave = annualLeave + sickLeave + otherLeave;
  
  // Calculate available hours after allocated hours and leave
  const allocatedHours = totalHours + totalLeave;
  const availableHours = Math.max(0, weeklyCapacity - allocatedHours);
  
  // Calculate utilization percentage
  const utilization = Math.round((totalHours / weeklyCapacity) * 100);
  
  // Get remarks for this member
  const memberRemarks = remarksData[member.id] || '';
  
  // Alternating row background
  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-muted/10';
  
  // Helper to get just the first name
  const getFirstName = (): string => {
    if (!member) return 'Unknown';
    return member.first_name || 'Unnamed';
  };

  // Helper to get member display name for tooltip
  const getMemberName = (): string => {
    if (!member) return 'Unknown';
    return `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Unnamed';
  };
  
  // Helper to get office location
  const getOfficeLocation = (): string => {
    return member.location || 'No office';
  };

  return (
    <TableRow key={member.id} className={`h-9 ${rowBg} hover:bg-muted/20`}>
      {/* Resource Name - Centered */}
      <TableCell className="sticky-column sticky-left-0 border-r font-medium py-1 text-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{getFirstName()}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getMemberName()}</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      
      {/* Projects Count - Centered with icon */}
      <TableCell className="sticky-column sticky-left-12 border-r p-0 text-center">
        <div className="flex items-center justify-center gap-1 py-1">
          <Briefcase size={14} className="text-muted-foreground" />
          <span className="text-xs font-medium">{projectCount}</span>
        </div>
      </TableCell>
      
      {/* Office Location - Centered with icon */}
      <TableCell className="sticky-column sticky-left-24 border-r p-0 text-center">
        <div className="flex items-center justify-center gap-1 py-1">
          <MapPin size={14} className="text-muted-foreground" />
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="text-xs truncate max-w-16">{getOfficeLocation()}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getOfficeLocation()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
      
      {/* Capacity Bar - horizontal */}
      <TableCell className="sticky-column sticky-left-36 border-r p-0 align-middle">
        <div className="flex justify-center px-2">
          <CapacityBar
            availableHours={availableHours} 
            totalCapacity={weeklyCapacity} 
          />
        </div>
      </TableCell>
      
      {/* Annual Leave Cell - with tooltip */}
      <TableCell className="border-r p-0 text-center w-[80px]">
        <LeaveTooltip leaveDays={leaveDays}>
          <div className={`w-full h-8 flex items-center justify-center ${annualLeave > 0 ? 'bg-[#F2FCE2]' : ''}`}>
            {annualLeave > 0 ? annualLeave : '—'}
          </div>
        </LeaveTooltip>
      </TableCell>
      
      {/* Sick/Medical Leave Cell */}
      <TableCell className="border-r p-0 text-center w-[80px]">
        <div className="allocation-input-container">
          <Input
            type="number"
            min="0"
            max="40"
            value={sickLeave || ''}
            onChange={(e) => onLeaveInputChange(member.id, 'sick', e.target.value)}
            className="w-full h-8 text-center p-0 bg-[#FEF7CD]"
            placeholder="0"
          />
        </div>
      </TableCell>
      
      {/* Other Leave Cell */}
      <TableCell className="border-r p-0 text-center w-[80px]">
        <div className="allocation-input-container">
          <Input
            type="number"
            min="0"
            max="40"
            value={otherLeave || ''}
            onChange={(e) => onLeaveInputChange(member.id, 'other', e.target.value)}
            className="w-full h-8 text-center p-0 bg-[#FEC6A1]"
            placeholder="0"
          />
        </div>
      </TableCell>
      
      {/* Remarks Cell */}
      <TableCell className="border-r p-0">
        <RemarksCell 
          memberId={member.id}
          initialRemarks={memberRemarks}
          onUpdate={onRemarksUpdate}
        />
      </TableCell>
      
      {/* Project allocation cells */}
      {projects.map(project => {
        const key = `${member.id}:${project.id}`;
        const hours = allocationMap.get(key) || 0;
        
        return (
          <TableCell 
            key={`${member.id}-${project.id}`} 
            className="leave-cell text-center border-r p-0 align-middle"
          >
            <ResourceAllocationCell 
              hours={hours}
              resourceId={member.id}
              projectId={project.id}
              weekStartDate={weekStartDate}
            />
          </TableCell>
        );
      })}
      
      {/* Total Column with Utilization Badge */}
      <TableCell className="text-center p-0">
        <div className="flex flex-col items-center py-1">
          <span className="font-medium">{totalHours}</span>
          <Badge 
            variant={utilization > 100 ? "destructive" : utilization > 80 ? "warning" : "outline"} 
            className="text-xs py-0 px-1.5 h-5"
          >
            {utilization}%
          </Badge>
        </div>
      </TableCell>
    </TableRow>
  );
};
