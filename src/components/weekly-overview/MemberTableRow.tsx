
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Project, MemberAllocation } from './types';

interface MemberTableRowProps {
  member: any;
  allocation: MemberAllocation;
  isEven: boolean;
  getOfficeDisplay: (locationCode: string) => string;
  onInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
}

export const MemberTableRow: React.FC<MemberTableRowProps> = ({
  member,
  allocation,
  isEven,
  getOfficeDisplay,
  onInputChange,
  projects
}) => {
  // Helper to get user initials
  const getUserInitials = (): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

  // Calculate total hours from project allocations
  const totalHours = allocation.projectAllocations.reduce((sum, project) => sum + project.hours, 0);
  const weeklyCapacity = member.weekly_capacity || 40;
  const utilizationPercent = weeklyCapacity > 0 ? Math.round((totalHours / weeklyCapacity) * 100) : 0;
  
  // Determine utilization color
  const getUtilizationColor = (percent: number) => {
    if (percent < 80) return 'bg-green-100 text-green-800 border-green-200';
    if (percent <= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <TableRow className={`member-row ${isEven ? 'even-row' : 'odd-row'}`}>
      {/* Member Name with Avatar */}
      <TableCell className="sticky left-0 z-10 bg-inherit">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarUrl()} alt={getMemberDisplayName()} />
            <AvatarFallback className="bg-brand-violet text-white text-xs">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {member.first_name} {member.last_name}
            </span>
            <span className="text-xs text-gray-500">
              {member.department || 'N/A'}
            </span>
          </div>
        </div>
      </TableCell>

      {/* Project Allocations */}
      {projects.map((project) => {
        const projectAllocation = allocation.projectAllocations.find(pa => pa.projectId === project.id);
        const projectHours = projectAllocation?.hours || 0;
        
        return (
          <TableCell key={project.id} className="text-center">
            <input
              type="number"
              min="0"
              max="40"
              step="0.5"
              value={projectHours || ''}
              onChange={(e) => {
                const newHours = parseFloat(e.target.value) || 0;
                const updatedProjectAllocations = [...allocation.projectAllocations];
                const existingIndex = updatedProjectAllocations.findIndex(pa => pa.projectId === project.id);
                
                if (existingIndex >= 0) {
                  updatedProjectAllocations[existingIndex] = {
                    ...updatedProjectAllocations[existingIndex],
                    hours: newHours
                  };
                } else {
                  updatedProjectAllocations.push({
                    projectId: project.id,
                    projectName: project.name,
                    projectCode: project.code,
                    hours: newHours
                  });
                }
                
                onInputChange(member.id, 'projectAllocations', updatedProjectAllocations);
              }}
              className="enhanced-input"
              placeholder="0"
            />
          </TableCell>
        );
      })}

      {/* Total Hours */}
      <TableCell className="text-center total-hours-column">
        <div className="enhanced-hours-pill">
          {totalHours}h
        </div>
      </TableCell>

      {/* Capacity */}
      <TableCell className="text-center capacity-column">
        <div className="enhanced-capacity-pill">
          {weeklyCapacity}h
        </div>
      </TableCell>

      {/* Utilization */}
      <TableCell className="text-center">
        <Badge 
          variant="outline" 
          className={`${getUtilizationColor(utilizationPercent)} text-xs font-medium`}
        >
          {utilizationPercent}%
        </Badge>
      </TableCell>

      {/* Leave */}
      <TableCell className="text-center">
        <input
          type="number"
          min="0"
          max="40"
          step="0.5"
          value={allocation.annualLeave || ''}
          onChange={(e) => onInputChange(member.id, 'annualLeave', parseFloat(e.target.value) || 0)}
          className="enhanced-input"
          placeholder="0"
        />
      </TableCell>

      {/* Remarks */}
      <TableCell>
        <textarea
          value={allocation.remarks || ''}
          onChange={(e) => onInputChange(member.id, 'remarks', e.target.value)}
          className="enhanced-textarea"
          placeholder="Notes..."
          rows={1}
        />
      </TableCell>
    </TableRow>
  );
};
