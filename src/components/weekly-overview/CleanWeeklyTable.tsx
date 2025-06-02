
import React from 'react';
import { Table, TableBody, TableFooter } from "@/components/ui/table";
import { CleanWeeklyHeader } from './CleanWeeklyHeader';
import { CleanTeamMemberRows } from './CleanTeamMemberRows';
import { CleanProjectTotalsRow } from './CleanProjectTotalsRow';
import { Project, MemberAllocation } from './types';
import './css/weekly-table-clean.css';

interface CleanWeeklyTableProps {
  projects: Project[];
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
  projectTotals: () => Record<string, number>;
}

export const CleanWeeklyTable: React.FC<CleanWeeklyTableProps> = ({
  projects,
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projectTotals
}) => {
  return (
    <div className="weekly-table-wrapper">
      <Table className="weekly-overview-table">
        <CleanWeeklyHeader projects={projects} />
        <TableBody>
          <CleanTeamMemberRows 
            filteredOffices={filteredOffices}
            membersByOffice={membersByOffice}
            getMemberAllocation={getMemberAllocation}
            getOfficeDisplay={getOfficeDisplay}
            handleInputChange={handleInputChange}
            projects={projects}
          />
        </TableBody>
        <TableFooter>
          <CleanProjectTotalsRow 
            projects={projects}
            projectTotals={projectTotals()}
          />
        </TableFooter>
      </Table>
    </div>
  );
};
