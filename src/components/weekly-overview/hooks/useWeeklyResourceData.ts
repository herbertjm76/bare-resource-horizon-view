
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { useCompany } from "@/context/CompanyContext";
import { useResourceAllocations } from './useResourceAllocations';
import { useOfficeMembers } from './useOfficeMembers';
import { useOfficeDisplay } from './useOfficeDisplay';
import { useCallback, useEffect, useState } from 'react';

export const useWeeklyResourceData = (selectedWeek: Date, filters: { office: string }) => {
  // Track loading state explicitly
  const [isInitializing, setIsInitializing] = useState(true);
  
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
      
      console.log("Fetched projects:", data?.length || 0);
      // Log the HERB project details if it exists
      const herbProject = data?.find(p => p.name.includes('HERB'));
      if (herbProject) {
        console.log("Found HERB project:", herbProject);
      }
      return data || [];
    },
    enabled: !!company?.id
  });
  
  // Get team members data - pass true to include inactive members
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
      
      console.log("Fetched pre-registered members:", data?.length || 0);
      
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
    console.log("All members for resource table:", combined.length);
    return combined;
  }, [teamMembers, preRegisteredMembers])();

  // Get allocations from custom hook
  const { 
    memberAllocations,
    getMemberAllocation, 
    handleInputChange, 
    isLoading: isLoadingAllocations,
    error: allocationsError,
    refreshAllocations,
    projectTotals
  } = useResourceAllocations(allMembers, selectedWeek);
  
  // Get office display helper
  const { getOfficeDisplay } = useOfficeDisplay();
  
  // Get members organized by office
  const { membersByOffice, filteredOffices } = useOfficeMembers(allMembers, filters);

  // Clear initialization state when data is loaded
  useEffect(() => {
    const dataIsReady = !isLoadingSession && !isLoadingMembers && 
                        !isLoadingPending && !isLoadingProjects && 
                        !isLoadingAllocations && Array.isArray(allMembers);
                         
    if (dataIsReady) {
      // Use a short delay to ensure all data is properly initialized
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [
    isLoadingSession, 
    isLoadingMembers, 
    isLoadingPending, 
    isLoadingProjects, 
    isLoadingAllocations, 
    allMembers
  ]);

  // Determine overall loading state
  const isLoading = isInitializing || isLoadingSession || isLoadingMembers || 
                    isLoadingPending || isLoadingAllocations || isLoadingProjects;

  // Determine if there are any errors - handle both string and Error types
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
