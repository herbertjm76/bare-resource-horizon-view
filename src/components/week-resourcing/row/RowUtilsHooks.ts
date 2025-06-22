
import { useMemo, useState, useCallback } from 'react';

export interface RowData {
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
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
  selectedWeek?: Date;
}

export const useRowData = (member: any, props: Omit<RowData, 'member' | 'memberIndex'>) => {
  const [editableOtherLeave, setEditableOtherLeave] = useState(0);
  
  // Memoize basic values to prevent recalculation
  const weeklyCapacity = useMemo(() => member?.weekly_capacity || 40, [member?.weekly_capacity]);
  const memberId = member?.id || '';
  
  const totalUsedHours = useMemo(() => props.getMemberTotal(memberId), [props.getMemberTotal, memberId]);
  const projectCount = useMemo(() => props.getProjectCount(memberId), [props.getProjectCount, memberId]);
  const annualLeave = useMemo(() => props.annualLeaveData[memberId] || 0, [props.annualLeaveData, memberId]);
  const holidayHours = useMemo(() => props.holidaysData[memberId] || 0, [props.holidaysData, memberId]);
  const otherLeave = useMemo(() => props.otherLeaveData?.[memberId] || 0, [props.otherLeaveData, memberId]);
  const leaveDays = useMemo(() => props.getWeeklyLeave(memberId), [props.getWeeklyLeave, memberId]);
  
  // Use the actual other leave data as the displayed value
  const displayedOtherLeave = otherLeave;
  
  const remarks = useMemo(() => {
    // This could be extended to include actual remarks from the database
    return '';
  }, []);

  // Determine if other leave is editable
  const isEditableOtherLeave = useMemo(() => {
    return typeof props.updateOtherLeave === "function";
  }, [props.updateOtherLeave]);

  const handleOtherLeaveChange = useCallback(async (value: number) => {
    if (props.updateOtherLeave && memberId) {
      const success = await props.updateOtherLeave(memberId, value);
      if (success) {
        setEditableOtherLeave(value);
      }
    }
    
    if (props.onOtherLeaveEdit && memberId) {
      props.onOtherLeaveEdit(memberId, value);
    }
  }, [props.updateOtherLeave, props.onOtherLeaveEdit, memberId]);

  const getProjectBreakdown = useCallback((project: any, hours: number) => ({
    projectName: project.name,
    projectCode: project.code,
    projectStage: project.current_stage || project.stage,
    projectFee: project.fee,
    hours: hours,
    isActive: !!(hours > 0)
  }), []);

  return useMemo(() => ({
    weeklyCapacity,
    totalUsedHours,
    projectCount,
    annualLeave,
    holidayHours,
    otherLeave,
    leaveDays,
    editableOtherLeave: isEditableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange,
    getProjectBreakdown
  }), [
    weeklyCapacity,
    totalUsedHours,
    projectCount,
    annualLeave,
    holidayHours,
    otherLeave,
    leaveDays,
    isEditableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange,
    getProjectBreakdown
  ]);
};
