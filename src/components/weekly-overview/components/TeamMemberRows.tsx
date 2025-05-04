
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
  selectedWeek: Date;
}

export const TeamMemberRows: React.FC<TeamMemberRowsProps> = ({
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projects,
  selectedWeek
}) => {
  return (
    <>
      {filteredOffices.flatMap((office, officeIndex) => {
        const members = membersByOffice[office].sort((a, b) => {
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        });

        return members.map((member, memberIndex) => {
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
              selectedWeek={selectedWeek}
            />
          );
        });
      })}
    </>
  );
};
