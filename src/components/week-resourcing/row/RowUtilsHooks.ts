
import { useMemo, useState } from 'react';

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
  
  const weeklyCapacity = member?.weekly_capacity || 40;
  const totalUsedHours = props.getMemberTotal(member?.id || '');
  const projectCount = props.getProjectCount(member?.id || '');
  const annualLeave = props.annualLeaveData[member?.id || ''] || 0;
  const holidayHours = props.holidaysData[member?.id || ''] || 0;
  const otherLeave = props.otherLeaveData?.[member?.id || ''] || 0;
  const leaveDays = props.getWeeklyLeave(member?.id || '');
  
  // Use the actual other leave data as the displayed value
  const displayedOtherLeave = otherLeave;
  
  const remarks = useMemo(() => {
    // This could be extended to include actual remarks from the database
    return '';
  }, []);

  const handleOtherLeaveChange = async (value: number) => {
    if (props.updateOtherLeave && member?.id) {
      const success = await props.updateOtherLeave(member.id, value);
      if (success) {
        setEditableOtherLeave(value);
      }
    }
    
    if (props.onOtherLeaveEdit && member?.id) {
      props.onOtherLeaveEdit(member.id, value);
    }
  };

  return {
    weeklyCapacity,
    totalUsedHours,
    projectCount,
    annualLeave,
    holidayHours,
    otherLeave,
    leaveDays,
    editableOtherLeave,
    displayedOtherLeave,
    remarks,
    handleOtherLeaveChange
  };
};
