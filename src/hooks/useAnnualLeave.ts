
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { generateDemoAnnualLeaves, DEMO_LEAVE_TYPES } from '@/data/demoData';
import { toast } from 'sonner';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, addDays, eachMonthOfInterval } from 'date-fns';

export interface LeaveEntry {
  id?: string;
  member_id: string;
  date: string;
  hours: number;
  company_id: string;
  leave_type_id?: string;
  leave_type_name?: string;
  leave_type_color?: string;
}

export interface LeaveDetail {
  hours: number;
  leave_type_id?: string;
  leave_type_name: string;
  leave_type_color: string;
}

export interface LeaveDataByDate {
  totalHours: number;
  entries: LeaveDetail[];
}

export type TimeRangeType = 'week' | 'month' | 'quarter' | 'year';

export const useAnnualLeave = (month: Date, timeRange: TimeRangeType = 'month') => {
  const [leaveData, setLeaveData] = useState<Record<string, Record<string, number>>>({});
  const [leaveDetails, setLeaveDetails] = useState<Record<string, Record<string, LeaveDataByDate>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();

  // Calculate date range based on time range selection
  const getDateRange = useCallback(() => {
    const today = new Date();
    switch (timeRange) {
      case 'week':
        return {
          start: subDays(startOfWeek(today, { weekStartsOn: 1 }), 3),
          end: addDays(endOfWeek(today, { weekStartsOn: 1 }), 3)
        };
      case 'month':
        return {
          start: subDays(startOfMonth(today), 3),
          end: addDays(endOfMonth(today), 3)
        };
      case 'quarter':
        return {
          start: startOfQuarter(today),
          end: endOfQuarter(today)
        };
      case 'year':
        return {
          start: startOfYear(today),
          end: endOfYear(today)
        };
      default:
        return {
          start: startOfMonth(month),
          end: endOfMonth(month)
        };
    }
  }, [timeRange, month]);

  // Function to fetch annual leave data
  const fetchLeaveData = useCallback(async () => {
    // Demo mode: use demo data
    if (isDemoMode) {
      const demoLeaves = generateDemoAnnualLeaves();
      const { start, end } = getDateRange();
      
      // Filter demo leaves by date range
      const filteredLeaves = demoLeaves.filter(leave => {
        const leaveDate = new Date(leave.date);
        return leaveDate >= start && leaveDate <= end;
      });

      // Transform to expected format
      const formattedData: Record<string, Record<string, number>> = {};
      const detailedData: Record<string, Record<string, LeaveDataByDate>> = {};

      filteredLeaves.forEach((leave) => {
        // Get leave type info
        const leaveType = DEMO_LEAVE_TYPES.find(lt => lt.id === leave.leave_type_id);
        const leaveTypeName = leaveType?.name || 'Leave';
        const leaveTypeColor = leaveType?.color || '#3B82F6';

        // Simple hours data
        if (!formattedData[leave.member_id]) {
          formattedData[leave.member_id] = {};
        }
        formattedData[leave.member_id][leave.date] = 
          (formattedData[leave.member_id][leave.date] || 0) + leave.hours;

        // Detailed data with leave type info
        if (!detailedData[leave.member_id]) {
          detailedData[leave.member_id] = {};
        }
        if (!detailedData[leave.member_id][leave.date]) {
          detailedData[leave.member_id][leave.date] = { totalHours: 0, entries: [] };
        }
        detailedData[leave.member_id][leave.date].totalHours += leave.hours;
        detailedData[leave.member_id][leave.date].entries.push({
          hours: leave.hours,
          leave_type_id: leave.leave_type_id,
          leave_type_name: leaveTypeName,
          leave_type_color: leaveTypeColor
        });
      });

      setLeaveData(formattedData);
      setLeaveDetails(detailedData);
      setIsLoading(false);
      return;
    }

    if (!company?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const { start, end } = getDateRange();
      
      // Get all months that need to be fetched
      const monthsToFetch = eachMonthOfInterval({ start, end });
      
      // Fetch data for all months in parallel
      const fetchPromises = monthsToFetch.map(async (monthDate) => {
        const monthStr = format(monthDate, 'yyyy-MM');
        
        const { data, error } = await supabase.functions.invoke('get_annual_leaves', {
          body: { 
            company_id_param: company.id,
            month_param: monthStr
          }
        });

        if (error) {
          console.error('Error fetching leave data for month:', monthStr, error);
          return [];
        }
        
        return data || [];
      });

      const allResults = await Promise.all(fetchPromises);
      const allData = allResults.flat();

      // Transform data into nested structure by member_id and date
      const formattedData: Record<string, Record<string, number>> = {};
      const detailedData: Record<string, Record<string, LeaveDataByDate>> = {};
      
      allData.forEach((leave: any) => {
        // Simple hours data (existing format)
        if (!formattedData[leave.member_id]) {
          formattedData[leave.member_id] = {};
        }
        formattedData[leave.member_id][leave.date] = 
          (formattedData[leave.member_id][leave.date] || 0) + leave.hours;
        
        // Detailed data with leave type info
        if (!detailedData[leave.member_id]) {
          detailedData[leave.member_id] = {};
        }
        if (!detailedData[leave.member_id][leave.date]) {
          detailedData[leave.member_id][leave.date] = { totalHours: 0, entries: [] };
        }
        detailedData[leave.member_id][leave.date].totalHours += leave.hours;
        detailedData[leave.member_id][leave.date].entries.push({
          hours: leave.hours,
          leave_type_id: leave.leave_type_id,
          leave_type_name: leave.leave_type_name || 'Leave',
          leave_type_color: leave.leave_type_color || '#3B82F6'
        });
      });

      setLeaveData(formattedData);
      setLeaveDetails(detailedData);
    } catch (error) {
      console.error('Error in fetchLeaveData:', error);
      toast.error('Failed to load annual leave data');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, getDateRange, isDemoMode]);

  // Update or create leave entries
  const updateLeaveHours = useCallback(async (
    memberId: string,
    date: string,
    hours: number,
    leaveTypeId?: string
  ) => {
    // Demo mode: show notification and skip update
    if (isDemoMode) {
      toast.info('Leave updates are disabled in demo mode');
      return;
    }

    if (!company?.id) return;

    try {
      setLeaveData(prev => {
        const updated = { ...prev };
        if (!updated[memberId]) {
          updated[memberId] = {};
        }
        
        if (hours === 0) {
          delete updated[memberId][date];
          if (Object.keys(updated[memberId]).length === 0) {
            delete updated[memberId];
          }
        } else {
          updated[memberId][date] = hours;
        }
        
        return updated;
      });

      const { data: existingData, error: checkError } = await supabase.functions.invoke('check_annual_leave_entry', {
        body: {
          member_id_param: memberId,
          date_param: date,
          company_id_param: company.id
        }
      });

      if (checkError) {
        console.error('Error checking leave entry:', checkError);
        throw checkError;
      }

      if (hours === 0 && existingData?.id) {
        await supabase.functions.invoke('delete_annual_leave', {
          body: {
            leave_id_param: existingData.id
          }
        });
      } else if (hours > 0) {
        if (existingData?.id) {
          await supabase.functions.invoke('update_annual_leave', {
            body: {
              leave_id_param: existingData.id,
              hours_param: hours,
              leave_type_id_param: leaveTypeId
            }
          });
        } else {
          await supabase.functions.invoke('create_annual_leave', {
            body: {
              member_id_param: memberId,
              date_param: date,
              hours_param: hours,
              company_id_param: company.id,
              leave_type_id_param: leaveTypeId
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating leave hours:', error);
      toast.error('Failed to update leave hours');
      fetchLeaveData();
    }
  }, [company?.id, fetchLeaveData, isDemoMode]);

  const realtimeRefreshTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // For demo mode or real mode, fetch leave data
    if (isDemoMode || company?.id) {
      fetchLeaveData();
    }
  }, [company?.id, timeRange, fetchLeaveData, isDemoMode]);

  useEffect(() => {
    // Skip realtime subscription in demo mode
    if (isDemoMode || !company?.id) return;

    const channel = supabase
      .channel(`annual-leaves-calendar:${company.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'annual_leaves',
          filter: `company_id=eq.${company.id}`,
        },
        () => {
          if (realtimeRefreshTimerRef.current) {
            window.clearTimeout(realtimeRefreshTimerRef.current);
          }
          realtimeRefreshTimerRef.current = window.setTimeout(() => {
            fetchLeaveData();
          }, 300);
        }
      )
      .subscribe();

    return () => {
      if (realtimeRefreshTimerRef.current) {
        window.clearTimeout(realtimeRefreshTimerRef.current);
        realtimeRefreshTimerRef.current = null;
      }
      supabase.removeChannel(channel);
    };
  }, [company?.id, fetchLeaveData, isDemoMode]);

  return {
    leaveData,
    leaveDetails,
    isLoading,
    updateLeaveHours,
    refreshLeaveData: fetchLeaveData
  };
};
