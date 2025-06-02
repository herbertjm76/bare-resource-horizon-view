
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
              
              return (
                <TableRow key={member.id}>
                  <TableCell className="font-medium text-left">
                    {member.first_name} {member.last_name}
                  </TableCell>
                  
                  {projects.map((project) => (
                    <TableCell key={project.id}>
                      <Input
                        type="number"
                        min="0"
                        max="40"
                        value={allocation.projects[project.id] || ''}
                        onChange={(e) => handleInputChange(member.id, 'projects', {
                          ...allocation.projects,
                          [project.id]: e.target.value ? parseInt(e.target.value) : 0
                        })}
                        className="w-16 h-8 text-xs text-center"
                      />
                    </TableCell>
                  ))}
                  
                  <TableCell className="font-medium">
                    {Object.values(allocation.projects).reduce((sum, hours) => sum + (hours || 0), 0)}
                  </TableCell>
                  
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={allocation.capacity || ''}
                      onChange={(e) => handleInputChange(member.id, 'capacity', e.target.value ? parseInt(e.target.value) : 0)}
                      className="w-16 h-8 text-xs text-center"
                    />
                  </TableCell>
                  
                  <TableCell>
                    {allocation.capacity > 0 
                      ? `${Math.round((Object.values(allocation.projects).reduce((sum, hours) => sum + (hours || 0), 0) / allocation.capacity) * 100)}%`
                      : '0%'
                    }
                  </TableCell>
                  
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      max="40"
                      value={allocation.leave || ''}
                      onChange={(e) => handleInputChange(member.id, 'leave', e.target.value ? parseInt(e.target.value) : 0)}
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
