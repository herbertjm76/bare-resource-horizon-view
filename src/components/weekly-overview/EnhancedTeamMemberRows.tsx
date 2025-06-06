import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Project, MemberAllocation } from './types';

interface EnhancedTeamMemberRowsProps {
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projects: Project[];
}

export const EnhancedTeamMemberRows: React.FC<EnhancedTeamMemberRowsProps> = ({
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projects
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

  return (
    <>
      {filteredOffices.map((office) => {
        const officeMembers = membersByOffice[office] || [];
        if (officeMembers.length === 0) return null;

        return (
          <React.Fragment key={office}>
            {/* Office Header Row */}
            <TableRow className="group-header-row">
              <TableCell colSpan={5 + projects.length} className="font-semibold">
                {getOfficeDisplay(office)} ({officeMembers.length} members)
              </TableCell>
            </TableRow>

            {/* Office Members */}
            {officeMembers.map((member, memberIndex) => {
              const allocation = getMemberAllocation(member.id);
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
                <TableRow key={member.id} className={`member-row ${memberIndex % 2 === 0 ? 'even-row' : 'odd-row'}`}>
                  {/* Member Name */}
                  <TableCell className="sticky left-0 z-10 bg-inherit">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback className="bg-brand-violet text-white text-xs">
                          {getUserInitials(member)}
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
                  {projects.map((project, projectIndex) => {
                    // Find allocation for this project
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
                            // Update the project allocations array
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
                            
                            handleInputChange(member.id, 'projectAllocations', updatedProjectAllocations);
                          }}
                          className="enhanced-input"
                          placeholder="0"
                        />
                      </TableCell>
                    );
                  })}

                  {/* Total Hours - Enhanced styling */}
                  <TableCell className="text-center total-hours-column">
                    <div className="enhanced-hours-pill">
                      {totalHours}h
                    </div>
                  </TableCell>

                  {/* Capacity - Enhanced styling with better spacing */}
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

                  {/* Annual Leave - READ-ONLY display with gray styling */}
                  <TableCell className="text-center">
                    <div className="inline-flex items-center justify-center w-8 h-6 text-xs font-medium rounded-lg bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300 text-gray-700 cursor-default">
                      {allocation.annualLeave || 0}h
                    </div>
                  </TableCell>

                  {/* Remarks */}
                  <TableCell>
                    <textarea
                      value={allocation.remarks || ''}
                      onChange={(e) => handleInputChange(member.id, 'remarks', e.target.value)}
                      className="enhanced-textarea"
                      placeholder="Notes..."
                      rows={1}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};
