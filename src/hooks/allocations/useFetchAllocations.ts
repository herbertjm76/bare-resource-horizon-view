
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { formatWeekKey } from '@/components/weekly-overview/utils';
import { MemberAllocation } from '@/components/weekly-overview/types';

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
      const weekKey = formatWeekKey(selectedWeek);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      
      // Fetch project allocations with project details for the selected week
      let projectAllocations = [];
      if (company?.id) {
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            id,
            resource_id,
            hours,
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
          console.log('Fetched project allocations for week:', weekKey, projectAllocations);
        }
      }
      
      // Initialize allocations object
      const initialAllocations: Record<string, MemberAllocation> = {};
      
      // Process each team member
      for (const member of teamMembers) {
        // Get this member's project allocations
        const memberProjects = projectAllocations.filter(alloc => 
          alloc.resource_id === member.id
        ) || [];
        
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
        
        initialAllocations[member.id] = {
          id: member.id,
          annualLeave: 0,
          publicHoliday: 0, // No longer using random values
          vacationLeave: 0,
          medicalLeave: 0,
          others: 0,
          remarks: '',
          projects: [...new Set(projectNames)], // Remove duplicates
          projectAllocations: detailedProjectAllocations,
          resourcedHours,
        };
      }
      
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
