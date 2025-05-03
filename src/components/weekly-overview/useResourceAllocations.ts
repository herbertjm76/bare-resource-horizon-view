
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfWeek } from 'date-fns';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';
import { formatWeekKey } from './utils';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
  weekly_capacity?: number;
}

export interface MemberAllocation {
  id: string;
  annualLeave: number;
  publicHoliday: number;
  vacationLeave: number;
  medicalLeave: number;
  others: number;
  remarks: string;
  projects: string[];
  resourcedHours: number;
}

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
      const weekKey = formatWeekKey(selectedWeek);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      
      // First, fetch project allocations with project details for the selected week
      let projectAllocations = [];
      if (company?.id) {
        const { data, error } = await supabase
          .from('project_resource_allocations')
          .select(`
            resource_id,
            hours,
            project:projects(id, name)
          `)
          .eq('week_start_date', weekKey)
          .eq('company_id', company.id)
          .in('resource_id', memberIds);
        
        if (error) {
          console.error('Error fetching project allocations:', error);
          setError('Failed to fetch resource allocations');
        } else {
          projectAllocations = data || [];
          console.log('Fetched project allocations:', projectAllocations);
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
        
        // Get project names
        const projectNames = memberProjects
          .filter(p => p.project?.name)
          .map(p => p.project.name);
        
        // For demo purposes - generate some random data for non-project time
        initialAllocations[member.id] = {
          id: member.id,
          annualLeave: 0,
          publicHoliday: Math.floor(Math.random() * 2) * 8, // Either 0 or 8 hours
          vacationLeave: 0,
          medicalLeave: 0,
          others: 0,
          remarks: '',
          projects: [...new Set(projectNames)], // Remove duplicates
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
        resourcedHours: 0,
      };
    }
    return memberAllocations[memberId];
  };

  // Handle input changes for editable fields
  const handleInputChange = (memberId: string, field: keyof MemberAllocation, value: any) => {
    const numValue = field !== 'remarks' && field !== 'projects' ? parseFloat(value) || 0 : value;
    
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

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading,
    error,
    refreshAllocations: fetchAllocations
  };
}
