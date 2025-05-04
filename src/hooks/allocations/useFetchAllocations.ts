
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatWeekKey, getWeekStartDate, getWeekDateRange } from '@/components/weekly-overview/utils';
import { MemberAllocation } from '@/components/weekly-overview/types';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Hook for fetching resource allocations from the database
 */
export function useFetchAllocations() {
  const { company } = useCompany();
  
  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async (
    teamMembers: TeamMember[], 
    selectedWeek: Date,
    setMemberAllocations: (allocations: Record<string, MemberAllocation>) => void,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ) => {
    if (!teamMembers || teamMembers.length === 0) {
      setIsLoading(false);
      setMemberAllocations({});
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the date range for the selected week
      const { startDateString, endDateString } = getWeekDateRange(selectedWeek);
      const weekKey = formatWeekKey(selectedWeek);
      
      console.log('Fetching allocations for date range:', startDateString, 'to', endDateString);
      console.log('Week key:', weekKey);
      console.log('Selected week JS date:', selectedWeek);
      console.log('Monday of selected week:', getWeekStartDate(selectedWeek));
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      console.log('Fetching allocations for members:', memberIds.length);
      
      // Fetch project allocations with project details for the selected week
      let projectAllocations = [];
      if (company?.id) {
        // First try exact date match
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            id,
            resource_id,
            hours,
            week_start_date,
            project:projects(id, name, code)
          `)
          .eq('week_start_date', weekKey)
          .eq('company_id', company.id)
          .in('resource_id', memberIds);
        
        if (error) {
          console.error('Error fetching project allocations:', error);
          setError('Failed to fetch resource allocations');
        } else {
          projectAllocations = data || [];
          console.log('Fetched project allocations for week key:', weekKey);
          console.log('Allocation count:', projectAllocations.length);
          
          // If no allocations found with exact date match, try a range query
          if (projectAllocations.length === 0) {
            console.log('No allocations found with exact date. Trying date range query...');
            
            const { data: rangeData, error: rangeError } = await supabase
              .from('project_resource_allocations')
              .select(`
                id,
                resource_id,
                hours,
                week_start_date,
                project:projects(id, name, code)
              `)
              .gte('week_start_date', startDateString)
              .lte('week_start_date', endDateString)
              .eq('company_id', company.id)
              .in('resource_id', memberIds);
              
            if (rangeError) {
              console.error('Error in date range query:', rangeError);
            } else {
              projectAllocations = rangeData || [];
              console.log('Found allocations with date range query:', projectAllocations.length);
            }
          }
          
          // If still no allocations, get the latest few weeks' data to help debug
          if (projectAllocations.length === 0) {
            console.log('No allocations found. Showing latest allocation dates for debugging...');
            
            const { data: dateData } = await supabase
              .from('project_resource_allocations')
              .select('week_start_date')
              .eq('company_id', company.id)
              .order('week_start_date', { ascending: false })
              .limit(20);
              
            // Get unique dates
            const uniqueDates = [...new Set(dateData?.map(item => item.week_start_date))];
            console.log('Latest allocation dates in DB:', uniqueDates);
            
            // Try to fetch again using the most recent date
            if (uniqueDates && uniqueDates.length > 0) {
              const latestDate = uniqueDates[0];
              console.log(`Trying to fetch with latest date: ${latestDate}`);
              
              const { data: latestData, error: latestError } = await supabase
                .from('project_resource_allocations')
                .select(`
                  id,
                  resource_id,
                  hours,
                  week_start_date,
                  project:projects(id, name, code)
                `)
                .eq('week_start_date', latestDate)
                .eq('company_id', company.id)
                .in('resource_id', memberIds);
                
              if (latestError) {
                console.error('Error fetching with latest date:', latestError);
              } else {
                projectAllocations = latestData || [];
                console.log(`Found ${projectAllocations.length} allocations using latest date: ${latestDate}`);
              }
            }
          }
        }
      }
      
      console.log('Project allocations before processing:', projectAllocations);
      
      // Initialize allocations object
      const initialAllocations: Record<string, MemberAllocation> = {};
      
      // Process each team member
      for (const member of teamMembers) {
        // Get this member's project allocations
        const memberProjects = projectAllocations.filter(alloc => 
          alloc.resource_id === member.id
        ) || [];
        
        console.log(`Member ${member.id} (${member.first_name} ${member.last_name}) allocations:`, memberProjects);
        
        // Calculate total resourced hours
        const resourcedHours = memberProjects.reduce(
          (sum, project) => sum + (Number(project.hours) || 0), 
          0
        );
        
        // Get project names and detailed allocations
        const projectNames = memberProjects
          .filter(p => p.project?.name)
          .map(p => p.project.name);
          
        // Create detailed project allocations array
        const detailedProjectAllocations = memberProjects
          .filter(p => p.project?.id && p.project?.name && p.project?.code)
          .map(p => ({
            projectName: p.project.name,
            projectId: p.project.id,
            projectCode: p.project.code,
            hours: Number(p.hours) || 0
          }))
          .sort((a, b) => b.hours - a.hours); // Sort by hours descending
        
        // For demonstration, create some leave data - in real app this would come from a leave table
        const annualLeave = Math.floor(Math.random() * 8);
        const vacationLeave = Math.floor(Math.random() * 8);
        const medicalLeave = Math.floor(Math.random() * 4);
        const others = Math.floor(Math.random() * 2);
        
        initialAllocations[member.id] = {
          id: member.id,
          annualLeave,
          publicHoliday: Math.floor(Math.random() * 2) * 8, // Either 0 or 8 hours
          vacationLeave,
          medicalLeave,
          others,
          remarks: '',
          projects: [...new Set(projectNames)], // Remove duplicates
          projectAllocations: detailedProjectAllocations,
          resourcedHours,
        };
      }
      
      console.log('Processed allocations:', initialAllocations);
      setMemberAllocations(initialAllocations);
    } catch (err) {
      console.error('Error fetching allocations:', err);
      setError('Failed to fetch resource allocations');
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [company?.id]);
  
  return { fetchAllocations };
}
