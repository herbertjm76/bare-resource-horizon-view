
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
  // Custom comparison to prevent unnecessary rerenders
  return (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap === nextProps.allocationMap &&
    prevProps.annualLeaveData === nextProps.annualLeaveData &&
    prevProps.holidaysData === nextProps.holidaysData &&
    prevProps.otherLeaveData === nextProps.otherLeaveData &&
    prevProps.getMemberTotal === nextProps.getMemberTotal &&
    prevProps.getProjectCount === nextProps.getProjectCount &&
    prevProps.getWeeklyLeave === nextProps.getWeeklyLeave &&
    prevProps.updateOtherLeave === nextProps.updateOtherLeave &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.onOtherLeaveEdit === nextProps.onOtherLeaveEdit
  );
});
