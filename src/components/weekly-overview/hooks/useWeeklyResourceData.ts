
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { useCompany } from "@/context/CompanyContext";
import { useResourceAllocations } from './useResourceAllocations';
import { useOfficeMembers } from './useOfficeMembers';
import { useOfficeDisplay } from './useOfficeDisplay';
import { useCallback } from 'react';

export const useWeeklyResourceData = (selectedWeek: Date, filters: { office: string }) => {
  // Get company context
  const { company } = useCompany();
  
  // Get current user ID
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    }
  });
  
  // Fetch all projects for the company
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['company-projects', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('projects')
        .select('id, code, name')
        .eq('company_id', company.id)
        .order('code');
      
      if (error) {
        console.error("Error fetching projects:", error);
        return [];
      }
      
      console.log("Fetched projects:", data);
      return data || [];
    },
    enabled: !!company?.id
  });
  
  // Get team members data using the hook - pass true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers, error: teamMembersError } = useTeamMembersData(true);
  
  // Get pending team members (pre-registered)
  const { data: preRegisteredMembers = [], isLoading: isLoadingPending, error: pendingError } = useQuery({
    queryKey: ['preRegisteredMembers', session?.user?.id, company?.id],
    queryFn: async () => {
      if (!session?.user?.id || !company?.id) return [];
      
      const { data, error } = await supabase
        .from('invites')
        .select('id, first_name, last_name, email, department, location, job_title, role, weekly_capacity')
        .eq('company_id', company.id)
        .eq('invitation_type', 'pre_registered')
        .eq('status', 'pending');
        
      if (error) {
        console.error("Error fetching pre-registered members:", error);
        return [];
      }
      
      console.log("Fetched pre-registered members:", data);
      
      // Transform the pre-registered members to match team member structure
      return data.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40
      }));
    },
    enabled: !!session?.user?.id && !!company?.id
  });

  // Get all members combined (active + pre-registered)
  const allMembers = useCallback(() => {
    const combined = [...(teamMembers || []), ...(preRegisteredMembers || [])];
    console.log("All members for resource table:", combined);
    return combined;
  }, [teamMembers, preRegisteredMembers])();

  // Get allocations from custom hook
  const { 
    getMemberAllocation, 
    handleInputChange, 
    isLoading: isLoadingAllocations,
    error: allocationsError,
    refreshAllocations,
    projectTotals
  } = useResourceAllocations(allMembers, selectedWeek);
  
  // Refresh allocations when week changes
  
  // Get office display helper
  const { getOfficeDisplay } = useOfficeDisplay();
  
  // Get members organized by office
  const { membersByOffice, filteredOffices } = useOfficeMembers(allMembers, filters);

  // Determine overall loading state
  const isLoading = isLoadingSession || isLoadingMembers || isLoadingPending || 
                    isLoadingAllocations || isLoadingProjects;

  // Determine if there are any errors
  const error = teamMembersError || pendingError || allocationsError;

  return {
    projects,
    allMembers,
    membersByOffice,
    filteredOffices,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    projectTotals,
    refreshAllocations,
    isLoading,
    error
  };
};
