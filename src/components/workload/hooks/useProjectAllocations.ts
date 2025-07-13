import { useState, useEffect } from 'react';
import { format, addDays, isWeekend } from 'date-fns';
import { getStandardizedDateRange } from '@/hooks/allocations';
import { useCompany } from '@/context/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { TeamMember } from '@/components/dashboard/types';

export const useProjectAllocations = (
  selectedMonth: Date, 
  teamMembers: TeamMember[], 
  companyId: string | undefined
) => {
  const [data, setData] = useState<Record<string, Record<string, number>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { company } = useCompany();

  useEffect(() => {
    if (!companyId || teamMembers.length === 0 || !company?.id) {
      setData({});
      setIsLoading(false);
      return;
    }

    const fetchProjectAllocations = async () => {
      setIsLoading(true);
      
      try {
        console.log('🔍 PROJECT ALLOCATIONS: Using standardized date range (Project Resources as source of truth)');
        
        // Use the SAME date range calculation as Project Resources
        const dateRange = getStandardizedDateRange(selectedMonth);
        const memberIds = teamMembers.map(member => member.id);
        
        console.log('🔍 PROJECT ALLOCATIONS: Date range:', dateRange);
        console.log('🔍 PROJECT ALLOCATIONS: Member IDs:', memberIds);

        // Fetch using the same query structure as Project Resources
        const { data: allocations, error } = await supabase
          .from('project_resource_allocations')
          .select('resource_id, hours, week_start_date, project_id, project:projects(name, code)')
          .eq('company_id', company.id)
          .in('resource_id', memberIds)
          .gte('week_start_date', dateRange.startDate)
          .lte('week_start_date', dateRange.endDate);
        
        if (error) {
          console.error('🔍 PROJECT ALLOCATIONS: Error fetching allocations:', error);
          setData({});
          return;
        }

        console.log('🔍 PROJECT ALLOCATIONS: Fetched', allocations?.length || 0, 'allocation records');
        console.log('🔍 PROJECT ALLOCATIONS: Raw data for debugging:', allocations);
        
        // Debug: Find Paul Julius specifically for July 7 week
        const paulJuliusAllocations = allocations?.filter(a => 
          a.resource_id === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' && // Paul's ID
          a.week_start_date === '2025-07-07' // July 7 week
        );
        console.log('🔍 DEBUG: Paul Julius allocations for July 7 week:', paulJuliusAllocations);
        
        const projectHours: Record<string, Record<string, number>> = {};
        
        // Initialize structure
        memberIds.forEach(memberId => {
          projectHours[memberId] = {};
        });
        
        allocations?.forEach(allocation => {
          if (!allocation.resource_id || !allocation.week_start_date || !allocation.hours) return;
          
          const weekStartDate = new Date(allocation.week_start_date);
          const weeklyHours = Number(allocation.hours) || 0;
          
          // Extra debug for Paul Julius July 7 week
          if (allocation.resource_id === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' && 
              allocation.week_start_date === '2025-07-07') {
            console.log(`🔍 DEBUG PAUL JULY 7: Processing ${weeklyHours}h from project ${allocation.project?.name}`);
          }
          
          console.log(`🔍 PROJECT ALLOCATIONS: Processing - Resource: ${allocation.resource_id}, Week: ${allocation.week_start_date}, Hours: ${weeklyHours}`);
          
          // Count actual working days (Monday to Friday) in this week that fall within the selected month
          const workingDays = [];
          for (let i = 0; i < 7; i++) {
            const day = addDays(weekStartDate, i);
            if (!isWeekend(day) && 
                day.getMonth() === selectedMonth.getMonth() && 
                day.getFullYear() === selectedMonth.getFullYear()) {
              workingDays.push(day);
            }
          }
          
          // Only distribute hours if there are working days
          if (workingDays.length > 0) {
            const dailyHours = weeklyHours / workingDays.length;
            
            // Extra debug for Paul Julius July 7
            if (allocation.resource_id === 'b06b0c9d-70c5-49cd-aae9-fcf9016ebe82' && 
                allocation.week_start_date === '2025-07-07') {
              console.log(`🔍 DEBUG PAUL JULY 7: Distributing ${weeklyHours}h across ${workingDays.length} working days = ${dailyHours}h per day`);
              console.log(`🔍 DEBUG PAUL JULY 7: Working days:`, workingDays.map(d => format(d, 'yyyy-MM-dd')));
            }
            
            workingDays.forEach(workDay => {
              const dateKey = format(workDay, 'yyyy-MM-dd');
              
              if (!projectHours[allocation.resource_id][dateKey]) {
                projectHours[allocation.resource_id][dateKey] = 0;
              }
              projectHours[allocation.resource_id][dateKey] += dailyHours;
            });
          }
        });
        
        console.log('🔍 PROJECT ALLOCATIONS: Final processed data (using Project Resources logic):', projectHours);
        setData(projectHours);
        
      } catch (error) {
        console.error('🔍 PROJECT ALLOCATIONS: Error:', error);
        setData({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectAllocations();
  }, [companyId, selectedMonth, teamMembers, company?.id]);

  return { data, isLoading };
};