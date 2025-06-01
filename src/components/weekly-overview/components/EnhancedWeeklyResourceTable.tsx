
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnhancedMemberTableRow } from '../EnhancedMemberTableRow';
import { EnhancedProjectTotalsRow } from '../EnhancedProjectTotalsRow';
import { Project, MemberAllocation } from '../types';
import '../../../ui/enhanced-table.css';

interface EnhancedWeeklyResourceTableProps {
  members: any[];
  projects: Project[];
  memberTotals: Record<string, number>;
  projectTotals: Record<string, number>;
  allocationMap: Map<string, number>;
  weekStartDate: string;
}

export const EnhancedWeeklyResourceTable: React.FC<EnhancedWeeklyResourceTableProps> = ({
  members,
  projects,
  memberTotals,
  projectTotals,
  allocationMap,
  weekStartDate
}) => {
  // Helper function to get member allocation data
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    // Create a default allocation object matching the MemberAllocation interface
    const projectAllocations = projects.map(project => {
      const key = `${memberId}:${project.id}`;
      const hours = allocationMap.get(key) || 0;
      return {
        projectName: project.name,
        projectId: project.id,
        hours: hours,
        projectCode: project.code
      };
    }).filter(allocation => allocation.hours > 0);

    return {
      id: memberId,
      annualLeave: 0,
      publicHoliday: 0,
      vacationLeave: 0,
      medicalLeave: 0,
      others: 0,
      remarks: '',
      projects: projectAllocations.map(p => p.projectName),
      resourcedHours: memberTotals[memberId] || 0,
      projectAllocations: projectAllocations
    };
  };

  // Helper function for office display (placeholder)
  const getOfficeDisplay = (locationCode: string) => locationCode || 'Unknown Office';

  // Helper function for input changes (placeholder)
  const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
    // This would need to be implemented with proper state management
    console.log('Input change:', memberId, field, value);
  };

  return (
    <div className="enhanced-table-scroll">
      <div className="enhanced-table-container">
        <Table className="enhanced-table">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky-left" style={{ left: 0, minWidth: '200px' }}>
                Team Member
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                Projects
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '100px' }}>
                Capacity
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                AL
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                Holiday
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                Other
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                Office
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '80px' }}>
                Total Hours
              </TableHead>
              <TableHead className="text-center" style={{ minWidth: '120px' }}>
                Total Hours
              </TableHead>
              
              {/* Project columns */}
              {projects.map(project => (
                <TableHead key={project.id} className="text-center" style={{ minWidth: '60px' }}>
                  <div className="text-xs font-bold transform -rotate-90 whitespace-nowrap">
                    {project.code || project.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {members.map((member, index) => (
              <EnhancedMemberTableRow
                key={member.id}
                member={member}
                allocation={getMemberAllocation(member.id)}
                isEven={index % 2 === 0}
                getOfficeDisplay={getOfficeDisplay}
                onInputChange={handleInputChange}
                projects={projects}
              />
            ))}
            
            {/* Project totals row */}
            <EnhancedProjectTotalsRow
              projects={projects}
              projectTotals={projectTotals}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
