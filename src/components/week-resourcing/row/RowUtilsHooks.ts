
import { useMemo, useCallback } from 'react';

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
  // Memoize calculated values to prevent unnecessary re-renders
  const weeklyCapacity = useMemo(() => member?.weekly_capacity || 40, [member?.weekly_capacity]);
  
  const totalUsedHours = useMemo(() => 
    props.getMemberTotal(member?.id || ''), 
    [props.getMemberTotal, member?.id]
  );
  
  const projectCount = useMemo(() => 
    props.getProjectCount(member?.id || ''), 
    [props.getProjectCount, member?.id]
  );
  
  const annualLeave = useMemo(() => 
    props.annualLeaveData[member?.id || ''] || 0, 
    [props.annualLeaveData, member?.id]
  );
  
  const holidayHours = useMemo(() => 
    props.holidaysData[member?.id || ''] || 0, 
    [props.holidaysData, member?.id]
  );
  
  const otherLeave = useMemo(() => 
    props.otherLeaveData?.[member?.id || ''] || 0, 
    [props.otherLeaveData, member?.id]
  );
  
  const leaveDays = useMemo(() => 
    props.getWeeklyLeave(member?.id || ''), 
    [props.getWeeklyLeave, member?.id]
  );
  
  // Use the actual other leave data as the displayed value
  const displayedOtherLeave = otherLeave;
  
  // Check if other leave editing is available
  const editableOtherLeave = typeof props.updateOtherLeave === "function";
  
  const remarks = useMemo(() => '', []);

  const handleOtherLeaveChange = useCallback(async (value: number) => {
    if (props.updateOtherLeave && member?.id) {
      const success = await props.updateOtherLeave(member.id, value);
      if (!success) {
        console.error('Failed to update other leave');
      }
    }
    
    if (props.onOtherLeaveEdit && member?.id) {
      props.onOtherLeaveEdit(member.id, value);
    }
  }, [props.updateOtherLeave, props.onOtherLeaveEdit, member?.id]);

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
    displayedOtherLeave,
    editableOtherLeave,
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
    displayedOtherLeave,
    editableOtherLeave,
    remarks,
    handleOtherLeaveChange,
    getProjectBreakdown
  ]);
};
