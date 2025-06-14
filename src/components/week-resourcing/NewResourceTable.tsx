
import React from 'react';
import { Table, TableBody } from '@/components/ui/table';
import { NewResourceTableHeader } from './NewResourceTableHeader';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceTableProps {
  members: any[];
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  viewMode?: 'compact' | 'expanded';
}

export const NewResourceTable: React.FC<NewResourceTableProps> = ({
  members,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode = 'compact'
}) => {
  if (members.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        <p>No team members found for the selected week.</p>
      </div>
    );
  }

  const tableClasses = viewMode === 'expanded' 
    ? 'resource-table-expanded' 
    : 'resource-table-compact';

  return (
    <div className="overflow-x-auto">
      <Table className={tableClasses}>
        <NewResourceTableHeader projects={projects} viewMode={viewMode} />
        <TableBody>
          {members.map((member, index) => (
            <NewResourceTableRow
              key={member.id}
              member={member}
              memberIndex={index}
              projects={projects}
              allocationMap={allocationMap}
              annualLeaveData={annualLeaveData}
              holidaysData={holidaysData}
              getMemberTotal={getMemberTotal}
              getProjectCount={getProjectCount}
              getWeeklyLeave={getWeeklyLeave}
              viewMode={viewMode}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
