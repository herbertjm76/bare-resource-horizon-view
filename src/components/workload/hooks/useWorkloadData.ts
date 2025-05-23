
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { TeamMember } from '@/components/dashboard/types';

export const useWorkloadData = (selectedMonth: Date, teamMembers: TeamMember[]) => {
  const [workloadData, setWorkloadData] = useState<Record<string, Record<string, number>>>({});
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
        
        // Generate all week start dates that cover the month
        const weekStartDates = new Set<string>();
        
        daysInMonth.forEach(day => {
          // Get Monday of the week containing this day
          const weekStart = startOfWeek(day, { weekStartsOn: 1 });
          weekStartDates.add(format(weekStart, 'yyyy-MM-dd'));
        });
        
        // Create a member ID list for the query
        const memberIds = teamMembers.map(member => member.id);
        
        // Fetch all resource allocations for these members in the given weeks
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id, project:projects(name, code)')
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .in('week_start_date', Array.from(weekStartDates));
        
        if (error) {
          console.error('Error fetching workload data:', error);
          setIsLoadingWorkload(false);
          return;
        }
        
        console.log('Fetched resource allocations:', allocations);
        
        // Process allocations to create a daily workload distribution
        const workload: Record<string, Record<string, number>> = {};
        
        // Initialize data structure for all members and days with zero hours
        teamMembers.forEach(member => {
          workload[member.id] = {};
          
          daysInMonth.forEach(day => {
            workload[member.id][format(day, 'yyyy-MM-dd')] = 0;
          });
        });

        // Process each allocation to distribute hours across the week
        if (allocations) {
          allocations.forEach(allocation => {
            if (!allocation.resource_id || !allocation.week_start_date) return;
            
            const weekStart = new Date(allocation.week_start_date);
            const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
            
            // Get workdays in this week that are also in the month
            const workdays = eachDayOfInterval({ start: weekStart, end: weekEnd })
              .filter(day => {
                // Only consider days that are in the selected month
                return day.getMonth() === selectedMonth.getMonth();
              })
              .filter(day => {
                // Filter out weekends (Saturday and Sunday)
                const dayOfWeek = day.getDay();
                return dayOfWeek !== 0 && dayOfWeek !== 6;
              });

            if (workdays.length === 0) return;
            
            // Calculate hours per day (evenly distributed across workdays)
            const hoursPerDay = allocation.hours / workdays.length;

            // Assign hours to each workday
            workdays.forEach(day => {
              const dateKey = format(day, 'yyyy-MM-dd');
              
              if (workload[allocation.resource_id] && 
                  workload[allocation.resource_id][dateKey] !== undefined) {
                workload[allocation.resource_id][dateKey] += hoursPerDay;
              }
            });
          });
        }
        
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
