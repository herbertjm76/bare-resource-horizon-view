
import { useCallback, useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useTeamMembersData = (includeInactive: boolean = false) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { company } = useCompany();

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading,
    error,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', refreshTrigger, company?.id],
    queryFn: async () => {
      console.log('Fetching team members, refresh trigger:', refreshTrigger);
      console.log('Include inactive members:', includeInactive);
      console.log('Company ID:', company?.id);
      
      try {
        if (!company?.id) {
          console.log('No company ID available, returning empty array');
          return [];
        }
        
        // Filter profiles by company_id
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load team members:', error);
          toast.error('Failed to load team members');
          throw error;
        }

        console.log('Fetched profiles:', profiles?.length || 0);
        return profiles as Profile[];
      } catch (fetchError) {
        console.error('Error in team members fetch function:', fetchError);
        toast.error('Error loading team members');
        return [];
      }
    },
    refetchInterval: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
    enabled: !!company?.id, // Only fetch when company ID is available
  });

  // Force refresh function - useful for debugging
  const forceRefresh = useCallback(() => {
    console.log('Force refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Manual refresh function that can be called from children
  const triggerRefresh = useCallback(() => {
    console.log('Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
    // Force immediate refetch
    refetchTeamMembers();
  }, [refetchTeamMembers]);

  return {
    teamMembers,
    isLoading,
    error, // Now we're properly exposing the error from the useQuery hook
    triggerRefresh,
    forceRefresh,
  };
};
