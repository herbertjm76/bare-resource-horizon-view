
import React, { useState } from 'react';

export interface RowData {
  member: any;
  memberIndex: number;
  projects: any[];
  allocationMap: Map<string, number>;
  annualLeaveData: Record<string, number>;
  holidaysData: Record<string, number>;
  getMemberTotal: (memberId: string) => number;
  getProjectCount: (memberId: string) => number;
  getWeeklyLeave: (memberId: string) => Array<{ date: string; hours: number }>;
  onOtherLeaveEdit?: (memberId: string, value: number) => void;
}

export const useRowData = (member: any, props: Omit<RowData, 'member' | 'memberIndex'>) => {
  const [otherLeave, setOtherLeave] = useState<number>(0);

  React.useEffect(() => {
    setOtherLeave(0);
  }, [member.id]);

  const weeklyCapacity = member.weekly_capacity || 40;
  const totalUsedHours = props.getMemberTotal(member.id);
  const projectCount = props.getProjectCount(member.id);
  const annualLeave = props.annualLeaveData[member.id] || 0;
  const holidayHours = props.holidaysData[member.id] || 0;
  const leaveDays = props.getWeeklyLeave(member.id);

  const editableOtherLeave = typeof props.onOtherLeaveEdit === "function";
  const displayedOtherLeave = editableOtherLeave ? otherLeave : 0;
  const remarks = "";

  const handleOtherLeaveChange = (value: number) => {
    setOtherLeave(value);
    if (props.onOtherLeaveEdit) {
      props.onOtherLeaveEdit(member.id, value);
    }
  };

  const getProjectBreakdown = (project: any, hours: number) => ({
    projectName: project.name,
    projectCode: project.code,
    projectStage: project.current_stage || project.stage,
    projectFee: project.fee,
    hours: hours,
    isActive: !!(hours > 0)
  });

  return {
    otherLeave,
    weeklyCapacity,
    totalUsedHours,
    projectCount,
    annualLeave,
    holidayHours,
    leaveDays,
    editableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange,
    getProjectBreakdown
  };
};
