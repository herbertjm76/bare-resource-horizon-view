
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfWeek } from 'date-fns';

interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  location: string | null;
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
  const [isSaving, setIsSaving] = useState(false);
  
  // Format date for database consistency
  const formatDateKey = (date: Date) => {
    return format(startOfWeek(date, { weekStartsOn: 1 }), 'yyyy-MM-dd');
  };

  // Fetch allocations for all team members for the selected week
  const fetchAllocations = useCallback(async () => {
    if (!teamMembers.length) return;
    
    setIsLoading(true);
    
    try {
      const weekKey = formatDateKey(selectedWeek);
      
      // Get all member IDs
      const memberIds = teamMembers.map(member => member.id);
      
      // Fetch project allocations for all active members for this week
      const { data: projectAllocations } = await supabase
        .from('project_resource_allocations')
        .select(`
          resource_id,
          hours,
          project:projects(id, name)
        `)
        .eq('resource_type', 'active')
        .eq('week_start_date', weekKey)
        .in('resource_id', memberIds);
      
      // Initialize allocations object
      const initialAllocations: Record<string, MemberAllocation> = {};
      
      // Process each team member
      for (const member of teamMembers) {
        // Get this member's project allocations
        const memberProjects = projectAllocations?.filter(alloc => 
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
        
        // For demo purposes - generate some random data
        initialAllocations[member.id] = {
          id: member.id,
          annualLeave: 0,
          publicHoliday: Math.floor(Math.random() * 8),
          vacationLeave: 0,
          medicalLeave: 0,
          others: 0,
          remarks: '',
          projects: [...new Set(projectNames)], // Remove duplicates
          resourcedHours,
        };
      }
      
      setMemberAllocations(initialAllocations);
    } catch (error) {
      console.error('Error fetching allocations:', error);
    } finally {
      setIsLoading(false);
    }
  }, [teamMembers, selectedWeek]);
  
  // Fetch allocations when team members or selected week changes
  useEffect(() => {
    if (teamMembers.length > 0) {
      fetchAllocations();
    }
  }, [teamMembers, selectedWeek, fetchAllocations]);

  // Initialize or get member allocation
  const getMemberAllocation = (memberId: string): MemberAllocation => {
    if (!memberAllocations[memberId]) {
      // Use default values if allocation not found
      const allocation = {
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
      setMemberAllocations(prev => ({...prev, [memberId]: allocation}));
      return allocation;
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
    // In a real implementation, we would save to a 'member_week_allocations' table
  };

  return {
    memberAllocations,
    getMemberAllocation,
    handleInputChange,
    isLoading,
    isSaving,
    refreshAllocations: fetchAllocations
  };
}
