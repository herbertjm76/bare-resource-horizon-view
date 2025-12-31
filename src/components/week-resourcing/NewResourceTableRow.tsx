
import React from 'react';
import { ExpandedRowView } from './row/MemoizedExpandedRowView';
import { CompactRowView } from './row/MemoizedCompactRowView';
import { logger } from '@/utils/logger';

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
  // Debug viewMode changes
  logger.debug(`NewResourceTableRow RENDER - Member ${member.id} received viewMode:`, viewMode);
  
  React.useEffect(() => {
    logger.debug(`NewResourceTableRow useEffect - Member ${member.id} viewMode changed to:`, viewMode);
  }, [viewMode, member.id]);
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
  // Include viewMode in the comparison to ensure re-render when view mode changes
  const isEqual = (
    prevProps.member.id === nextProps.member.id &&
    prevProps.memberIndex === nextProps.memberIndex &&
    prevProps.viewMode === nextProps.viewMode &&
    prevProps.projects.length === nextProps.projects.length &&
    prevProps.allocationMap.size === nextProps.allocationMap.size &&
    prevProps.annualLeaveData === nextProps.annualLeaveData &&
    prevProps.holidaysData === nextProps.holidaysData &&
    prevProps.otherLeaveData === nextProps.otherLeaveData
  );
  
  // Debug log to see when component should re-render
  if (!isEqual) {
    logger.debug('NewResourceTableRow re-rendering due to prop changes:', {
      memberId: nextProps.member.id,
      viewMode: nextProps.viewMode,
      previousViewMode: prevProps.viewMode
    });
  }
  
  return isEqual;
});
