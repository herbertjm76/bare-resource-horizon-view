
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
  // New comprehensive functions
  getMemberTotal?: (memberId: string) => number;
  getProjectCount?: (memberId: string) => number;
  allocationMap?: Map<string, number>;
}

export const WeeklyResourceTableContainer: React.FC<WeeklyResourceTableContainerProps> = ({
  projects,
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projectTotals,
  getMemberTotal,
  getProjectCount,
  allocationMap
}) => {
  // Calculate project totals using the comprehensive allocation map if available
  const calculateProjectTotals = () => {
    if (allocationMap && getMemberTotal) {
      const totals: Record<string, number> = {};
      
      // Calculate totals from the comprehensive allocation map
      allocationMap.forEach((hours, key) => {
        const [memberId, projectId] = key.split(':');
        if (!totals[projectId]) {
          totals[projectId] = 0;
        }
        totals[projectId] += hours;
      });
      
      return totals;
    }
    
    // Fallback to legacy calculation
    return projectTotals();
  };

  const calculatedProjectTotals = calculateProjectTotals();

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
              getMemberTotal={getMemberTotal}
              getProjectCount={getProjectCount}
              allocationMap={allocationMap}
            />
          </TableBody>
          <TableFooter>
            <ProjectTotalsRow 
              projects={projects}
              projectTotals={calculatedProjectTotals}
            />
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
