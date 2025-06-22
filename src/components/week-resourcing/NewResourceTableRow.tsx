
import React from 'react';
import { ExpandedRowView } from './row/MemoizedExpandedRowView';
import { CompactRowView } from './row/MemoizedCompactRowView';

interface NewResourceTableRowProps {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  otherLeaveData?: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  updateOtherLeave?: (memberId: string, hours: number, notes?: string) => Promise<boolean>;
  viewMode?: 'compact' | 'expanded';
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
  selectedWeek?: Date;
}

export const NewResourceTableRow: React.FC<NewResourceTableRowProps> = React.memo(({
  member,
  memberIndex,
  projects,
  allocationMap,
  annualLeaveData,
  holidaysData,
  otherLeaveData = {},
  getMemberTotal,
  getProjectCount,
  getWeeklyLeave,
  updateOtherLeave,
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
    otherLeaveData,
    getMemberTotal,
    getProjectCount,
    getWeeklyLeave,
    updateOtherLeave,
    onOtherLeaveEdit,
    selectedWeek,
  };

  if (viewMode === 'expanded') {
    return <ExpandedRowView {...sharedProps} viewMode="expanded" />;
  }

  return <CompactRowView {...sharedProps} viewMode="compact" />;
}, (prevProps, nextProps) => {
  // Simplified comparison - only check essential props that actually change
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap.size === nextProps.allocationMap.size &&
    // Compare critical data objects by reference (they should be stable from the hook)
    prevProps.annualLeaveData === nextProps.annualLeaveData &&
    prevProps.holidaysData === nextProps.holidaysData &&
    prevProps.otherLeaveData === nextProps.otherLeaveData
  );
});
