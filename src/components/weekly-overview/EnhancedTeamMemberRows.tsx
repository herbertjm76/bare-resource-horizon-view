
import React from 'react';
import { EnhancedMemberTableRow } from './EnhancedMemberTableRow';
import { TableRow, TableCell } from "@/components/ui/table";
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
  return (
    <>
      {filteredOffices.map((officeCode, officeIndex) => {
        const members = membersByOffice[officeCode] || [];
        const officeDisplay = getOfficeDisplay(officeCode);
        
        return (
          <React.Fragment key={officeCode}>
            {/* Enhanced Office header row */}
            <TableRow className="office-header-row">
              <TableCell 
                colSpan={9 + projects.length} 
                className="py-3 px-4 font-semibold text-white"
              >
                {officeDisplay} ({members.length} {members.length === 1 ? 'member' : 'members'})
              </TableCell>
            </TableRow>
            
            {/* Enhanced Member rows for this office */}
            {members.map((member, index) => {
              const allocation = getMemberAllocation(member.id);
              return (
                <EnhancedMemberTableRow 
                  key={member.id}
                  member={member}
                  allocation={allocation}
                  isEven={index % 2 === 0}
                  getOfficeDisplay={getOfficeDisplay}
                  onInputChange={handleInputChange}
                  projects={projects}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};
