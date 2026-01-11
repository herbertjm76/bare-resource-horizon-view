
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Project, MemberAllocation } from './types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatCapacityValue } from '@/utils/allocationDisplay';
import { getAllocationCapacity } from '@/utils/allocationCapacity';

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

  return (
    <>
      {filteredOffices.map((office) => {
        const officeMembers = membersByOffice[office] || [];
        if (officeMembers.length === 0) return null;

        return (
          <React.Fragment key={office}>
            {/* Office Header Row */}
            <TableRow className="bg-muted/30">
              <TableCell 
                colSpan={5 + projects.length} 
                className="py-2 px-4 font-medium text-foreground"
              >
                {getOfficeDisplay(office)} ({officeMembers.length} {officeMembers.length === 1 ? 'member' : 'members'})
              </TableCell>
            </TableRow>

            {/* Office Members */}
            {officeMembers.map((member, memberIndex) => {
              const allocation = getMemberAllocation(member.id);
              // Calculate total hours from project allocations
              const totalHours = allocation.projectAllocations.reduce((sum, project) => sum + project.hours, 0);
              // IMPORTANT: Use getAllocationCapacity for consistent % <-> hours conversions
              const weeklyCapacity = getAllocationCapacity({
                displayPreference,
                workWeekHours,
                memberWeeklyCapacity: member.weekly_capacity,
              });
              const utilizationPercent = weeklyCapacity > 0 ? Math.round((totalHours / weeklyCapacity) * 100) : 0;
              
              // Determine utilization color
              const getUtilizationColor = (percent: number) => {
                if (percent < 80) return 'bg-green-100 text-green-800 border-green-200';
                if (percent <= 100) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
                return 'bg-red-100 text-red-800 border-red-200';
              };

                return (
                <TableRow key={member.id} className={`${memberIndex % 2 === 0 ? 'bg-card' : 'bg-muted/50'} hover:bg-blue-50/30 transition-colors`}>
                  {/* Member Name with Avatar */}
                  <TableCell className="sticky left-0 z-10 bg-inherit border-r">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback style={{ background: 'hsl(var(--gradient-start))' }} className="text-white text-xs">
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm text-foreground">
                          {member.first_name} {member.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
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
                      <TableCell key={project.id} className="text-center p-2">
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
                            
                            handleInputChange(member.id, 'projectAllocations', updatedProjectAllocations);
                          }}
                          className="w-full max-w-[60px] px-2 py-1 text-center border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </TableCell>
                    );
                  })}

                  {/* Total Hours */}
                  <TableCell className="text-center p-2">
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full min-w-[50px]">
                      {formatAllocationValue(totalHours, weeklyCapacity, displayPreference)}
                    </div>
                  </TableCell>

                  {/* Capacity */}
                  <TableCell className="text-center p-2">
                    <div className="inline-flex items-center justify-center px-2 py-1 bg-muted text-foreground text-sm font-medium rounded-full min-w-[50px]">
                      {formatCapacityValue(weeklyCapacity, displayPreference)}
                    </div>
                  </TableCell>

                  {/* Utilization */}
                  <TableCell className="text-center p-2">
                    <Badge 
                      variant="outline" 
                      className={`${getUtilizationColor(utilizationPercent)} text-xs font-medium`}
                    >
                      {utilizationPercent}%
                    </Badge>
                  </TableCell>

                  {/* Leave */}
                  <TableCell className="text-center p-2">
                    <input
                      type="number"
                      min="0"
                      max="40"
                      step="0.5"
                      value={allocation.annualLeave || ''}
                      onChange={(e) => handleInputChange(member.id, 'annualLeave', parseFloat(e.target.value) || 0)}
                      className="w-full max-w-[60px] px-2 py-1 text-center border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </TableCell>

                  {/* Remarks */}
                  <TableCell className="p-2">
                    <textarea
                      value={allocation.remarks || ''}
                      onChange={(e) => handleInputChange(member.id, 'remarks', e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
