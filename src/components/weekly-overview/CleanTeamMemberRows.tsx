import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { CapacityIndicator } from './components/CapacityIndicator';
import { Project, MemberAllocation } from './types';

interface CleanTeamMemberRowsProps {
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
}

export const CleanTeamMemberRows: React.FC<CleanTeamMemberRowsProps> = ({
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projects
}) => {
  const allMembers = filteredOffices.flatMap(office => 
    membersByOffice[office]?.map(member => ({ ...member, office })) || []
  );

  return (
    <>
      {allMembers.map((member, memberIndex) => {
        const allocation = getMemberAllocation(member.id);
        const weeklyCapacity = member.weekly_capacity || 40;
        
        // Calculate total project hours
        const totalProjectHours = projects.reduce((sum, project) => {
          return sum + (allocation.projects[project.id] || 0);
        }, 0);
        
        // Calculate available hours (capacity - total hours - leave)
        const totalLeave = (allocation.annual_leave || 0) + (allocation.other_leave || 0);
        const availableHours = Math.max(0, weeklyCapacity - totalProjectHours - totalLeave);
        
        const isEvenRow = memberIndex % 2 === 0;
        
        return (
          <TableRow 
            key={`${member.id}-${member.office}`}
            className={`text-xs border-b ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            {/* Name column */}
            <TableCell className="name-column font-medium text-left p-2 border-r">
              <div className="truncate" title={member.name}>
                {member.name}
              </div>
            </TableCell>
            
            {/* Number of Projects */}
            <TableCell className="number-column p-2 border-r">
              <div className="flex justify-center">
                <span className="project-pill">
                  {Object.values(allocation.projects).filter(hours => hours > 0).length}
                </span>
              </div>
            </TableCell>
            
            {/* Capacity with colored indicators */}
            <TableCell className="capacity-column p-2 border-r">
              <CapacityIndicator
                availableHours={availableHours}
                totalCapacity={weeklyCapacity}
              />
            </TableCell>
            
            {/* Annual Leave */}
            <TableCell className="number-column leave-column p-2 border-r">
              <input
                type="number"
                min="0"
                max="40"
                value={allocation.annual_leave || ''}
                onChange={(e) => handleInputChange(member.id, 'annual_leave', parseFloat(e.target.value) || 0)}
                className="leave-input"
                placeholder="0"
              />
            </TableCell>
            
            {/* Other Leave */}
            <TableCell className="number-column leave-column p-2 border-r">
              <input
                type="number"
                min="0"
                max="40"
                value={allocation.other_leave || ''}
                onChange={(e) => handleInputChange(member.id, 'other_leave', parseFloat(e.target.value) || 0)}
                className="leave-input"
                placeholder="0"
              />
            </TableCell>
            
            {/* Office */}
            <TableCell className="remarks-column p-2 border-r text-center">
              <span className="text-xs text-gray-600">
                {getOfficeDisplay(member.location)}
              </span>
            </TableCell>
            
            {/* Project allocation columns */}
            {projects.map((project) => (
              <TableCell key={project.id} className="project-hours-column p-2 border-r">
                <input
                  type="number"
                  min="0"
                  max="40"
                  value={allocation.projects[project.id] || ''}
                  onChange={(e) => handleInputChange(member.id, 'projects', {
                    ...allocation.projects,
                    [project.id]: parseFloat(e.target.value) || 0
                  })}
                  className="w-full h-6 text-center text-xs border border-gray-300 rounded px-1"
                  placeholder="0"
                />
              </TableCell>
            ))}
          </TableRow>
        );
      })}
    </>
  );
};
