
import React from 'react';
import { MemberTableRow } from '../MemberTableRow';
import { Project } from '../types';

interface TeamMemberRowsProps {
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => any;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: string, value: any) => void;
  projects: Project[];
}

export const TeamMemberRows: React.FC<TeamMemberRowsProps> = ({
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projects
}) => {
  return (
    <>
      {filteredOffices.flatMap((office, officeIndex) => {
        const members = membersByOffice[office].sort((a, b) => {
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        });
        
        // Add office header row for print layout
        const officeDisplay = getOfficeDisplay(office);
        
        return [
          // Office header for print view only
          <tr key={`office-header-${office}`} className="hidden print:table-row print:font-bold print:bg-gray-200">
            <td colSpan={9 + projects.length} className="py-2 px-4 text-left">
              Office: {officeDisplay}
            </td>
          </tr>,
          
          // Office header visible in regular view
          <tr key={`office-visible-header-${office}`} className="bg-muted/30 print:hidden">
            <td colSpan={9 + projects.length} className="py-1 px-4 text-left">
              <div className="text-sm font-semibold">{officeDisplay}</div>
            </td>
          </tr>,
          
          // Regular member rows
          ...members.map((member, memberIndex) => {
            const allocation = getMemberAllocation(member.id);
            const isEven = memberIndex % 2 === 0;
            
            return (
              <MemberTableRow
                key={member.id}
                member={member}
                allocation={allocation}
                isEven={isEven}
                getOfficeDisplay={getOfficeDisplay}
                onInputChange={handleInputChange}
                projects={projects}
              />
            );
          })
        ];
      })}
    </>
  );
};
