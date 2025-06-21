
import React from 'react';
import { NewResourceTableRow } from './NewResourceTableRow';

interface NewResourceRowProps {
  member: any;
  projects: any[];
  allocationMap: Map<string, number>;
  index: number;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => number;
  viewMode: 'compact' | 'expanded';
}

export const NewResourceRow: React.FC<NewResourceRowProps> = ({
  member,
  projects,
  allocationMap,
  index,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode
}) => {
  return (
    <NewResourceTableRow
      member={member}
      memberIndex={index}
      projects={projects}
      allocationMap={allocationMap}
      annualLeaveData={{}}
      holidaysData={{}}
      getMemberTotal={getMemberTotal}
      getProjectCount={getProjectCount}
      getWeeklyLeave={() => []}
      viewMode={viewMode}
    />
  );
};
