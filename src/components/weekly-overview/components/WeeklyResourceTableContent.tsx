
import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { WeeklyResourceHeader } from '../WeeklyResourceHeader';
import { MemberTableRow } from '../MemberTableRow';
import { TableLoadingState } from './TableLoadingState';
import { TableErrorState } from './TableErrorState';
import { TableEmptyState } from './TableEmptyState';
import { useWeeklyResourceData } from '../hooks/useWeeklyResourceData';
import '../weekly-overview.css';

interface WeeklyResourceTableContentProps {
  selectedWeek: Date;
  filters: {
    office: string;
  };
}

export const WeeklyResourceTableContent: React.FC<WeeklyResourceTableContentProps> = ({
  selectedWeek,
  filters
}) => {
  const {
    allMembers,
    filteredOffices,
    membersByOffice,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    isLoading,
    error
  } = useWeeklyResourceData(selectedWeek, filters);

  if (isLoading) {
    return <TableLoadingState />;
  }

  if (error) {
    return <TableErrorState error={error} />;
  }

  if (!allMembers.length) {
    return <TableEmptyState />;
  }

  return (
    <div className="overflow-x-auto w-full max-w-full">
      <Table className="weekly-table">
        <WeeklyResourceHeader />
        <TableBody>
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
                />
              );
            });
          })}
        </TableBody>
      </Table>
    </div>
  );
};
