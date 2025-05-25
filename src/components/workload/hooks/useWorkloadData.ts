
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, addDays, startOfWeek } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export interface WorkloadBreakdown {
  projectHours: number;
  annualLeave: number;
  officeHolidays: number;
  otherLeave: number;
  total: number;
}

export const useWorkloadData = (selectedMonth: Date, teamMembers: TeamMember[]) => {
  const [workloadData, setWorkloadData] = useState<Record<string, Record<string, WorkloadBreakdown>>>({});
  const [isLoadingWorkload, setIsLoadingWorkload] = useState<boolean>(true);
  const { company } = useCompany();

  useEffect(() => {
    if (!company?.id || teamMembers.length === 0) {
      setIsLoadingWorkload(false);
      return;
    }

    const fetchWorkloadData = async () => {
      setIsLoadingWorkload(true);
      
      try {
        // Get all days in the selected month
        const daysInMonth = eachDayOfInterval({
          start: startOfMonth(selectedMonth),
          end: endOfMonth(selectedMonth)
        });
        
        // Create start and end date strings for the month
        const monthStart = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
        
        // Create a member ID list for the query
        const memberIds = teamMembers.map(member => member.id);
        
        console.log('Fetching comprehensive workload data for member IDs:', memberIds);
        console.log('Month range:', monthStart, 'to', monthEnd);
        
        // Initialize data structure for all members and days
        const workload: Record<string, Record<string, WorkloadBreakdown>> = {};
        teamMembers.forEach(member => {
          workload[member.id] = {};
          daysInMonth.forEach(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            workload[member.id][dateKey] = {
              projectHours: 0,
              annualLeave: 0,
              officeHolidays: 0,
              otherLeave: 0,
              total: 0
            };
          });
        });

        // 1. Fetch project allocations
        const { data: allocations, error: allocationsError } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id, project:projects(name, code)')
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .gte('week_start_date', monthStart)
          .lte('week_start_date', monthEnd);
        
        if (allocationsError) {
          console.error('Error fetching project allocations:', allocationsError);
        } else if (allocations) {
          allocations.forEach(allocation => {
            if (!allocation.resource_id || !allocation.week_start_date || !allocation.hours) return;
            
            const allocationDate = allocation.week_start_date;
            const dateKey = format(new Date(allocationDate), 'yyyy-MM-dd');
            const allocationDateObj = new Date(allocationDate);
            
            if (allocationDateObj.getMonth() === selectedMonth.getMonth() && 
                allocationDateObj.getFullYear() === selectedMonth.getFullYear()) {
              
              const totalHours = Number(allocation.hours) || 0;
              
              if (workload[allocation.resource_id] && 
                  workload[allocation.resource_id][dateKey] !== undefined) {
                workload[allocation.resource_id][dateKey].projectHours += totalHours;
              }
            }
          });
        }

        // 2. Fetch annual leave data
        const { data: annualLeaveData, error: annualLeaveError } = await supabase
          .from('annual_leaves')
          .select('member_id, date, hours')
          .eq('company_id', company.id)
          .in('member_id', memberIds)
          .gte('date', monthStart)
          .lte('date', monthEnd);
        
        if (annualLeaveError) {
          console.error('Error fetching annual leave data:', annualLeaveError);
        } else if (annualLeaveData) {
          annualLeaveData.forEach(leave => {
            const dateKey = format(new Date(leave.date), 'yyyy-MM-dd');
            const hours = Number(leave.hours) || 0;
            
            if (workload[leave.member_id] && workload[leave.member_id][dateKey]) {
              workload[leave.member_id][dateKey].annualLeave += hours;
            }
          });
        }

        // 3. Fetch office holidays
        const { data: holidaysData, error: holidaysError } = await supabase
          .from('office_holidays')
          .select('date, end_date, name')
          .eq('company_id', company.id)
          .or(`date.lte.${monthEnd},end_date.gte.${monthStart}`);
        
        if (holidaysError) {
          console.error('Error fetching office holidays:', holidaysError);
        } else if (holidaysData) {
          holidaysData.forEach(holiday => {
            const startDate = new Date(holiday.date);
            const endDate = holiday.end_date ? new Date(holiday.end_date) : startDate;
            
            // Apply holiday hours to all days in the holiday range
            const holidayDays = eachDayOfInterval({ start: startDate, end: endDate });
            
            holidayDays.forEach(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              
              // Check if this day is in our selected month
              if (day.getMonth() === selectedMonth.getMonth() && 
                  day.getFullYear() === selectedMonth.getFullYear()) {
                
                // Apply to all team members (assuming 8 hours standard holiday)
                memberIds.forEach(memberId => {
                  if (workload[memberId] && workload[memberId][dateKey]) {
                    workload[memberId][dateKey].officeHolidays = 8;
                  }
                });
              }
            });
          });
        }

        // 4. Fetch weekly other leave data
        // Get all week start dates that overlap with our month
        const weekStarts: string[] = [];
        let currentWeekStart = startOfWeek(startOfMonth(selectedMonth), { weekStartsOn: 1 });
        const monthEndDate = endOfMonth(selectedMonth);
        
        while (currentWeekStart <= monthEndDate) {
          weekStarts.push(format(currentWeekStart, 'yyyy-MM-dd'));
          currentWeekStart = addDays(currentWeekStart, 7);
        }

        const { data: otherLeaveData, error: otherLeaveError } = await supabase
          .from('weekly_other_leave')
          .select('member_id, week_start_date, hours, leave_type, notes')
          .eq('company_id', company.id)
          .in('member_id', memberIds)
          .in('week_start_date', weekStarts);
        
        if (otherLeaveError) {
          console.error('Error fetching weekly other leave data:', otherLeaveError);
        } else if (otherLeaveData) {
          otherLeaveData.forEach(leave => {
            const weekStartDate = new Date(leave.week_start_date);
            const hours = Number(leave.hours) || 0;
            
            // Distribute hours across the work week (Monday to Friday)
            const dailyHours = hours / 5; // Assuming 5 working days per week
            
            for (let i = 0; i < 5; i++) {
              const workDay = addDays(weekStartDate, i);
              const dateKey = format(workDay, 'yyyy-MM-dd');
              
              // Check if this day is in our selected month
              if (workDay.getMonth() === selectedMonth.getMonth() && 
                  workDay.getFullYear() === selectedMonth.getFullYear()) {
                
                if (workload[leave.member_id] && workload[leave.member_id][dateKey]) {
                  workload[leave.member_id][dateKey].otherLeave += dailyHours;
                }
              }
            }
          });
        }

        // Calculate totals for each day
        Object.keys(workload).forEach(memberId => {
          Object.keys(workload[memberId]).forEach(dateKey => {
            const breakdown = workload[memberId][dateKey];
            breakdown.total = breakdown.projectHours + breakdown.annualLeave + breakdown.officeHolidays + breakdown.otherLeave;
          });
        });
        
        console.log('Final comprehensive workload data:', workload);
        setWorkloadData(workload);
      } catch (error) {
        console.error('Error in workload data processing:', error);
      } finally {
        setIsLoadingWorkload(false);
      }
    };

    fetchWorkloadData();
  }, [company?.id, selectedMonth, teamMembers]);

  return { workloadData, isLoadingWorkload };
};
