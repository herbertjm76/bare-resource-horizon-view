
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EnhancedMemberTableRow } from '../EnhancedMemberTableRow';
import { EnhancedProjectTotalsRow } from '../EnhancedProjectTotalsRow';
import { Project } from '../types';
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
            {members.map((member) => (
              <EnhancedMemberTableRow
                key={member.id}
                member={member}
                projects={projects}
                memberTotals={memberTotals}
                allocationMap={allocationMap}
                weekStartDate={weekStartDate}
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
