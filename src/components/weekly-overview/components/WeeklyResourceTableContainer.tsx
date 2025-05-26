
import React from 'react';
import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { WeeklyResourceHeader } from '../WeeklyResourceHeader';
import { TeamMemberRows } from './TeamMemberRows';
import { ProjectTotalsRow } from './ProjectTotalsRow';
import { Project, MemberAllocation } from '../types';

interface WeeklyResourceTableContainerProps {
  projects: Project[];
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projectTotals: () => Record<string, number>;
}

export const WeeklyResourceTableContainer: React.FC<WeeklyResourceTableContainerProps> = ({
  projects,
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projectTotals
}) => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="weekly-table-container">
        <Table className="min-w-full text-xs weekly-table">
          <WeeklyResourceHeader projects={projects} />
          <TableBody>
            <TeamMemberRows 
              filteredOffices={filteredOffices}
              membersByOffice={membersByOffice}
              getMemberAllocation={getMemberAllocation}
              getOfficeDisplay={getOfficeDisplay}
              handleInputChange={handleInputChange}
              projects={projects}
            />
          </TableBody>
          <TableFooter>
            <ProjectTotalsRow 
              projects={projects}
              projectTotals={projectTotals()}
            />
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
