
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  return (
    <>
      {allMembers.map((member, memberIndex) => {
        const allocation = getMemberAllocation(member.id);
        const weeklyCapacity = member.weekly_capacity || 40;
        
        // Calculate total project hours from projectAllocations array
        const totalProjectHours = allocation.projectAllocations.reduce((sum, project) => {
          return sum + (project.hours || 0);
        }, 0);
        
        // Calculate available hours (capacity - total hours - leave)
        const totalLeave = (allocation.annualLeave || 0) + (allocation.others || 0);
        const availableHours = Math.max(0, weeklyCapacity - totalProjectHours - totalLeave);
        
        const isEvenRow = memberIndex % 2 === 0;
        
        return (
          <TableRow 
            key={`${member.id}-${member.office}`}
            className={`text-xs border-b ${isEvenRow ? 'bg-white' : 'bg-gray-50/50'}`}
          >
            {/* Name column with avatar */}
            <TableCell className="name-column font-medium text-left p-2 border-r">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                  <AvatarFallback className="bg-brand-violet text-white text-xs">
                    {getUserInitials(member)}
                  </AvatarFallback>
                </Avatar>
                <div className="truncate" title={member.name}>
                  {member.name}
                </div>
              </div>
            </TableCell>
            
            {/* Number of Projects */}
            <TableCell className="number-column p-2 border-r">
              <div className="flex justify-center">
                <span className="project-pill">
                  {allocation.projectAllocations.filter(project => (project.hours || 0) > 0).length}
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
                value={allocation.annualLeave || ''}
                onChange={(e) => handleInputChange(member.id, 'annualLeave', parseFloat(e.target.value) || 0)}
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
                value={allocation.others || ''}
                onChange={(e) => handleInputChange(member.id, 'others', parseFloat(e.target.value) || 0)}
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
            {projects.map((project) => {
              // Find the allocation for this specific project
              const projectAllocation = allocation.projectAllocations.find(
                pa => pa.projectId === project.id
              );
              const projectHours = projectAllocation?.hours || 0;
              
              return (
                <TableCell key={project.id} className="project-hours-column p-2 border-r">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={projectHours || ''}
                    onChange={(e) => {
                      const newHours = parseFloat(e.target.value) || 0;
                      const updatedAllocations = allocation.projectAllocations.filter(
                        pa => pa.projectId !== project.id
                      );
                      if (newHours > 0) {
                        updatedAllocations.push({
                          projectId: project.id,
                          projectName: project.name,
                          projectCode: project.code,
                          hours: newHours
                        });
                      }
                      handleInputChange(member.id, 'projectAllocations', updatedAllocations);
                    }}
                    className="w-full h-6 text-center text-xs border border-gray-300 rounded px-1"
                    placeholder="0"
                  />
                </TableCell>
              );
            })}
          </TableRow>
        );
      })}
    </>
  );
};
