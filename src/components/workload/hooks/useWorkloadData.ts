
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
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
        
        // Create start and end date strings for the month
        const monthStart = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
        const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
        
        // Create a member ID list for the query
        const memberIds = teamMembers.map(member => member.id);
        
        console.log('Fetching workload data for member IDs:', memberIds);
        console.log('Month range:', monthStart, 'to', monthEnd);
        
        // Fetch all resource allocations for these members in the given month
        // Query by actual allocation date rather than week ranges
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id, project:projects(name, code)')
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .gte('week_start_date', monthStart)
          .lte('week_start_date', monthEnd);
        
        if (error) {
          console.error('Error fetching workload data:', error);
          setIsLoadingWorkload(false);
          return;
        }
        
        console.log('Fetched resource allocations for workload:', allocations);
        
        // Process allocations as daily data (not weekly redistribution)
        const workload: Record<string, Record<string, number>> = {};
        
        // Initialize data structure for all members and days with zero hours
        teamMembers.forEach(member => {
          workload[member.id] = {};
          
          daysInMonth.forEach(day => {
            workload[member.id][format(day, 'yyyy-MM-dd')] = 0;
          });
        });

        // Process each allocation as a daily allocation
        if (allocations) {
          allocations.forEach(allocation => {
            if (!allocation.resource_id || !allocation.week_start_date || !allocation.hours) return;
            
            // Use the week_start_date as the actual allocation date
            const allocationDate = allocation.week_start_date;
            const dateKey = format(new Date(allocationDate), 'yyyy-MM-dd');
            
            // Check if this date falls within our month
            const allocationDateObj = new Date(allocationDate);
            if (allocationDateObj.getMonth() === selectedMonth.getMonth() && 
                allocationDateObj.getFullYear() === selectedMonth.getFullYear()) {
              
              const totalHours = Number(allocation.hours) || 0;
              
              console.log(`Adding ${totalHours} hours for resource ${allocation.resource_id} on ${dateKey}, project ${allocation.project?.name || allocation.project_id}`);

              // Add hours directly to the specific date
              if (workload[allocation.resource_id] && 
                  workload[allocation.resource_id][dateKey] !== undefined) {
                workload[allocation.resource_id][dateKey] += totalHours;
              }
            }
          });
        }
        
        console.log('Final workload data:', workload);
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
