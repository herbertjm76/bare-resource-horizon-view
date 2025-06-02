
import React from 'react';
import { TableRow, TableCell } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
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
  return (
    <>
      {filteredOffices.map((officeCode) => {
        const members = membersByOffice[officeCode] || [];
        if (members.length === 0) return null;

        return (
          <React.Fragment key={officeCode}>
            {/* Office Header Row */}
            <TableRow className="weekly-office-header">
              <TableCell colSpan={projects.length + 6}>
                {getOfficeDisplay(officeCode)} ({members.length} members)
              </TableCell>
            </TableRow>
            
            {/* Member Rows */}
            {members.map((member) => {
              const allocation = getMemberAllocation(member.id);
              
              // Calculate total project hours from projectAllocations
              const totalProjectHours = allocation.projectAllocations.reduce((sum, project) => {
                return sum + (Number(project.hours) || 0);
              }, 0);
              
              // Use member's weekly_capacity or default to 40
              const capacity = member.weekly_capacity || 40;
              
              // Calculate utilization percentage
              const utilizationPercentage = capacity > 0 
                ? Math.round((totalProjectHours / capacity) * 100)
                : 0;
              
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-left">
                    {member.first_name} {member.last_name}
                  </TableCell>
                  
                  {projects.map((project) => {
                    // Find the specific project allocation for this project
                    const projectAllocation = allocation.projectAllocations.find(
                      p => p.projectId === project.id
                    );
                    const projectHours = projectAllocation?.hours || 0;
                    
                    return (
                      <TableCell key={project.id}>
                        <Input
                          type="number"
                          min="0"
                          max="40"
                          value={projectHours || ''}
                          onChange={(e) => {
                            const newHours = e.target.value ? parseInt(e.target.value) : 0;
                            // Update the projectAllocations array
                            const updatedAllocations = allocation.projectAllocations.filter(
                              p => p.projectId !== project.id
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
                          className="w-16 h-8 text-xs text-center"
                        />
                      </TableCell>
                    );
                  })}
                  
                  <TableCell className="font-medium">
                    {totalProjectHours}
                  </TableCell>
                  
                  <TableCell>
                    {capacity}
                  </TableCell>
                  
                  <TableCell>
                    {utilizationPercentage}%
                  </TableCell>
                  
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={allocation.annualLeave || ''}
                      onChange={(e) => handleInputChange(member.id, 'annualLeave', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-16 h-8 text-xs text-center"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Input
                      type="text"
                      value={allocation.remarks || ''}
                      onChange={(e) => handleInputChange(member.id, 'remarks', e.target.value)}
                      className="w-32 h-8 text-xs"
                      placeholder="Notes..."
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
