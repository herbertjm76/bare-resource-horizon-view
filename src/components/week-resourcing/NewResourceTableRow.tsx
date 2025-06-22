
import React from 'react';
import { ExpandedRowView } from './row/ExpandedRowView';
import { CompactRowView } from './row/CompactRowView';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  viewMode?: 'compact' | 'expanded';
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
  selectedWeek?: Date;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = ({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  viewMode = 'compact',
  onOtherLeaveEdit,
  selectedWeek = new Date(),
}) => {
  const sharedProps = {
    member,
    memberIndex,
    projects,
    allocationMap,
    annualLeaveData,
    holidaysData,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    onOtherLeaveEdit,
    selectedWeek,
  };

  if (viewMode === 'expanded') {
    return <ExpandedRowView {...sharedProps} viewMode="expanded" />;
  }

  return <CompactRowView {...sharedProps} viewMode="compact" />;
};
