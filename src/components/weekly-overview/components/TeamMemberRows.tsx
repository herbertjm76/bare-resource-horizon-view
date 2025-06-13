
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
  // New comprehensive functions
  getMemberTotal?: (memberId: string) => number;
  getProjectCount?: (memberId: string) => number;
  allocationMap?: Map<string, number>;
}

export const TeamMemberRows: React.FC<TeamMemberRowsProps> = ({
  filteredOffices,
  membersByOffice,
  getMemberAllocation,
  getOfficeDisplay,
  handleInputChange,
  projects,
  getMemberTotal,
  getProjectCount,
  allocationMap
}) => {
  // Helper to get user initials
  const getUserInitials = (member: any): string => {
    const firstName = member.first_name || '';
    const lastName = member.last_name || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Helper to get avatar URL safely
  const getAvatarUrl = (member: any): string | undefined => {
    return 'avatar_url' in member ? member.avatar_url || undefined : undefined;
  };

  // Helper to get member display name
  const getMemberDisplayName = (member: any): string => {
    return `${member.first_name || ''} ${member.last_name || ''}`.trim();
  };

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
                  getMemberTotal={getMemberTotal}
                  getProjectCount={getProjectCount}
                  allocationMap={allocationMap}
                />
              );
            })}
          </React.Fragment>
        );
      })}
    </>
  );
};
