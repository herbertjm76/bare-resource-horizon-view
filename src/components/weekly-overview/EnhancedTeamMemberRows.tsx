import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Project, MemberAllocation } from './types';
import { useAppSettings } from '@/hooks/useAppSettings';
import { formatAllocationValue, formatCapacityValue, formatDualAllocationValue, getInputConfig, convertInputToHours, convertHoursToInputValue } from '@/utils/allocationDisplay';
import { getAllocationCapacity } from '@/utils/allocationCapacity';

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
  const { displayPreference, workWeekHours } = useAppSettings();
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
            <TableRow 
              className="group-header-row"
              style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.08)' }}
            >
              <TableCell 
                colSpan={5 + projects.length} 
                className="font-semibold"
                style={{ 
                  backgroundColor: 'hsl(var(--theme-primary) / 0.08)',
                  color: 'hsl(var(--foreground))',
                  borderBottom: '1px solid hsl(var(--theme-primary) / 0.15)'
                }}
              >
                {getOfficeDisplay(office)} ({officeMembers.length} members)
              </TableCell>
            </TableRow>

            {/* Office Members */}
            {officeMembers.map((member, memberIndex) => {
              const allocation = getMemberAllocation(member.id);
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

              // Theme-based alternating row colors
              const rowBgColor = memberIndex % 2 === 0 
                ? 'hsl(var(--background))' 
                : 'hsl(var(--theme-primary) / 0.02)';

              return (
                <TableRow 
                  key={member.id} 
                  className="member-row transition-colors"
                  style={{ backgroundColor: rowBgColor }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'hsl(var(--theme-primary) / 0.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = rowBgColor}
                >
                  {/* Member Name */}
                  <TableCell 
                    className="sticky left-0 z-10 pl-3"
                    style={{ backgroundColor: 'hsl(var(--theme-primary) / 0.05)' }}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={getAvatarUrl(member)} alt={getMemberDisplayName(member)} />
                        <AvatarFallback 
                          className="text-xs"
                          style={{ 
                            backgroundColor: 'hsl(var(--theme-primary))',
                            color: 'white'
                          }}
                        >
                          {getUserInitials(member)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {member.first_name} {member.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
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
                    const inputConfig = getInputConfig(displayPreference);
                    const displayValue = convertHoursToInputValue(projectHours, weeklyCapacity, displayPreference);
                    
                    return (
                      <TableCell key={project.id} className="text-center">
                        <input
                          type="number"
                          min={inputConfig.min}
                          max={inputConfig.max}
                          step={inputConfig.step}
                          value={displayValue || ''}
                          onChange={(e) => {
                            const inputValue = parseFloat(e.target.value) || 0;
                            const newHours = convertInputToHours(inputValue, weeklyCapacity, displayPreference);

                            console.debug('[alloc-debug] WeeklyOverview EnhancedTeamMemberRows change', {
                              inputValue,
                              displayPreference,
                              weeklyCapacity,
                              workWeekHours,
                              memberWeeklyCapacity: member?.weekly_capacity,
                              computedHours: newHours,
                              priorProjectHours: projectHours,
                              projectId: project.id,
                              memberId: member.id,
                            });

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
                          placeholder={inputConfig.placeholder}
                        />
                      </TableCell>
                    );
                  })}

                  {/* Total Hours - Enhanced styling */}
                  <TableCell className="text-center total-hours-column">
                    <div className="enhanced-hours-pill">
                      {formatDualAllocationValue(totalHours, weeklyCapacity, displayPreference)}
                    </div>
                  </TableCell>

                  {/* Capacity - Enhanced styling with better spacing */}
                  <TableCell className="text-center capacity-column">
                    <div className="enhanced-capacity-pill">
                      {formatCapacityValue(weeklyCapacity, displayPreference)}
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
                    <div className="inline-flex items-center justify-center w-auto px-2 h-6 text-xs font-medium rounded-lg bg-muted text-muted-foreground border border-border cursor-default">
                      {formatDualAllocationValue(allocation.annualLeave || 0, weeklyCapacity, displayPreference)}
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
