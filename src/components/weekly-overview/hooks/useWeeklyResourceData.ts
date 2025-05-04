
import { useCallback, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTeamMembersData } from "@/hooks/useTeamMembersData";
import { useCompany } from "@/context/CompanyContext";
import { useResourceAllocations } from '../useResourceAllocations';

// Define the TeamMember interface that includes the isPending property
interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  location: string | null;
  weekly_capacity?: number;
  isPending?: boolean; // Add the isPending property
}

export function useWeeklyResourceData(selectedWeek: Date, filters: { office: string }) {
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
  
  // Get team members data using the hook - pass true to include inactive members
  const { teamMembers, isLoading: isLoadingMembers, error: teamMembersError } = useTeamMembersData(true);
  
  // Get pending team members (pre-registered)
  const { data: preRegisteredMembers = [], isLoading: isLoadingPending, error: pendingError } = useQuery({
    queryKey: ['preRegisteredMembers', session?.user?.id, company?.id],
    queryFn: async () => {
      if (!session?.user?.id || !company?.id) return [];
      
      // Get pre-registered members from invites table
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
      
      // Transform the pre-registered members to match team member structure
      return data.map(member => ({
        id: member.id,
        first_name: member.first_name || '',
        last_name: member.last_name || '',
        email: member.email || '',
        location: member.location || null,
        weekly_capacity: member.weekly_capacity || 40,
        isPending: true // Set isPending flag to true for pre-registered members
      }));
    },
    enabled: !!session?.user?.id && !!company?.id
  });

  // Get all members combined (active + pre-registered)
  const allMembers = useMemo(() => {
    // Make sure to add isPending=false to regular team members
    const activeMembers = (teamMembers || []).map(member => ({
      ...member,
      isPending: false // Set isPending flag to false for active team members
    }));
    return [...activeMembers, ...(preRegisteredMembers || [])];
  }, [teamMembers, preRegisteredMembers]);

  // Get allocations from custom hook
  const { 
    getMemberAllocation, 
    handleInputChange, 
    isLoading: isLoadingAllocations,
    error: allocationsError 
  } = useResourceAllocations(allMembers, selectedWeek);

  // Fetch office locations
  const { data: officeLocations = [], isLoading: isLoadingOffices, error: officesError } = useQuery({
    queryKey: ['officeLocations', company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, code, city, country')
        .eq('company_id', company.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!company?.id
  });

  // Determine overall loading state
  const isLoading = isLoadingSession || isLoadingMembers || isLoadingPending || isLoadingAllocations || isLoadingOffices;

  // Determine if there are any errors
  const error = teamMembersError || pendingError || allocationsError || officesError;

  // Group team members by office
  const membersByOffice = useMemo(() => {
    return allMembers.reduce((acc, member) => {
      const location = member.location || 'Unassigned';
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(member);
      return acc;
    }, {} as Record<string, typeof allMembers>);
  }, [allMembers]);

  // Filter by selected office if needed
  const filteredOffices = useMemo(() => {
    let offices = Object.keys(membersByOffice);
    
    if (filters.office !== 'all') {
      offices = offices.filter(office => office === filters.office);
    }
    
    // Sort offices alphabetically
    return offices.sort();
  }, [membersByOffice, filters.office]);

  // Helper function to get office code display name
  const getOfficeDisplay = useCallback((locationCode: string) => {
    const office = officeLocations.find(o => o.code === locationCode);
    return office ? `${office.code}` : locationCode;
  }, [officeLocations]);

  return {
    allMembers,
    membersByOffice,
    filteredOffices,
    getMemberAllocation,
    handleInputChange,
    getOfficeDisplay,
    isLoading,
    error
  };
}
