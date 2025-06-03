
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberTableRow } from '../MemberTableRow';
import { TableRow, TableCell } from "@/components/ui/table";
import { Project, MemberAllocation } from '../types';

interface TeamMemberRowsProps {
  filteredOffices: string[];
  membersByOffice: Record<string, any[]>;
  getMemberAllocation: (memberId: string) => MemberAllocation;
  getOfficeDisplay: (locationCode: string) => string;
  handleInputChange: (memberId: string, field: keyof MemberAllocation, value: any) => void;
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
      {filteredOffices.map((officeCode, officeIndex) => {
        const members = membersByOffice[officeCode] || [];
        const officeDisplay = getOfficeDisplay(officeCode);
        
        return (
          <React.Fragment key={officeCode}>
            {/* Office header row */}
            <TableRow className="bg-muted/30">
              <TableCell 
                colSpan={9 + projects.length} 
                className="py-2 px-4 font-medium"
              >
                {officeDisplay} ({members.length} {members.length === 1 ? 'member' : 'members'})
              </TableCell>
            </TableRow>
            
            {/* Member rows for this office */}
            {members.map((member, index) => {
              const allocation = getMemberAllocation(member.id);
              return (
                <MemberTableRow 
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
