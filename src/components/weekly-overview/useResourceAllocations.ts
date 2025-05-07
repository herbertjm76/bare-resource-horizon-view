
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatWeekKey, getWeekStartDate } from './utils';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { MemberAllocation } from './types';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

/**
 * Main hook that manages resource allocations for the weekly overview
 */
export function useResourceAllocations(teamMembers: TeamMember[], selectedWeek: Date) {
  // Member allocations state
  const [memberAllocations, setMemberAllocations] = useState<Record<string, MemberAllocation>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();
  
  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async () => {
    if (!teamMembers || teamMembers.length === 0) {
      setIsLoading(false);
      setMemberAllocations({});
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get the Monday of the selected week
      const monday = getWeekStartDate(selectedWeek);
      
      // Get the Sunday of the selected week for databases that start weeks on Sunday
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() - 1);
      
      // Format both dates for database queries
      const mondayKey = formatWeekKey(selectedWeek);
      const sundayKey = sunday.toISOString().split('T')[0];
      
      console.log('Looking for allocations with dates:', mondayKey, 'or', sundayKey);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      
      // Fetch project allocations with project details for the selected week
      let projectAllocations = [];
      if (company?.id) {
        // Query for allocations with either Monday OR Sunday as the week_start_date
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            resource_id,
            hours,
            week_start_date,
            project:projects(id, name, code)
          `)
          .or(`week_start_date.eq.${mondayKey},week_start_date.eq.${sundayKey}`)
          .eq('company_id', company.id)
          .in('resource_id', memberIds);
        
        if (error) {
          console.error('Error fetching project allocations:', error);
          setError('Failed to fetch resource allocations');
        } else {
          projectAllocations = data || [];
          console.log('Fetched project allocations for dates:', mondayKey, 'or', sundayKey, projectAllocations);
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
        
        console.log(`Member ${member.first_name} ${member.last_name} allocations:`, memberProjects);
        
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
          publicHoliday: Math.floor(Math.random() * 2) * 8, // Either 0 or 8 hours
          vacationLeave: 0,
          medicalLeave: 0,
          others: 0,
          remarks: '',
          projects: [...new Set(projectNames)], // Remove duplicates
          projectAllocations: detailedProjectAllocations,
          resourcedHours,
        };
      }
      
      console.log('Final processed allocations:', initialAllocations);
      setMemberAllocations(initialAllocations);
    } catch (err) {
      console.error('Error fetching allocations:', err);
      setError('Failed to fetch resource allocations');
      toast.error('Failed to fetch resource allocations');
    } finally {
      setIsLoading(false);
    }
  }, [teamMembers, selectedWeek, company?.id]);
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    fetchAllocations();
  }, [fetchAllocations]);

  // Initialize or get member allocation
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    if (!memberAllocations[memberId]) {
      // Use default values if allocation not found
      return {
        id: memberId,
        annualLeave: 0,
        publicHoliday: 0,
        vacationLeave: 0,
        medicalLeave: 0,
        others: 0,
        remarks: '',
        projects: [],
        projectAllocations: [],
        resourcedHours: 0,
      };
    }
    return memberAllocations[memberId];
  };

  // Handle input changes for editable fields
  const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
    const numValue = field !== 'remarks' && field !== 'projects' && field !== 'projectAllocations' 
      ? parseFloat(value) || 0 
      : value;
    
    // Update local state for immediate UI feedback
    setMemberAllocations(prev => ({
      ...prev,
      [memberId]: {
        ...prev[memberId],
        [field]: numValue,
      }
    }));
    
    // Here we would save changes to the database
    // For now we're just updating the local state
  };

  // Calculate totals for each project
  const projectTotals = useCallback(() => {
    const totals: Record<string, number> = {};
    
    Object.values(memberAllocations).forEach(allocation => {
      allocation.projectAllocations.forEach(project => {
        if (!totals[project.projectId]) {
          totals[project.projectId] = 0;
        }
        totals[project.projectId] += project.hours;
      });
    });
    
    return totals;
  }, [memberAllocations]);

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading,
    error,
    refreshAllocations: fetchAllocations,
    projectTotals
  };
}
