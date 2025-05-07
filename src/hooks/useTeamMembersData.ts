
import { useCallback, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";

export const useTeamMembersData = (includeInactive: boolean = false) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading,
    error,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', refreshTrigger],
    queryFn: async () => {
      console.log('Fetching team members, refresh trigger:', refreshTrigger);
      console.log('Include inactive members:', includeInactive);
      
      try {
        // We're fetching directly without relying on a user profile
        // In a real app, you might want to get the company_id from a context or other source
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
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
