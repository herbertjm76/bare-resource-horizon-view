
import { useCallback, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";

export const useTeamMembersData = (userId: string | null) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading
  } = useQuery({
    queryKey: ['userProfile', userId, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching user profile for ID:', userId);
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      console.log('User profile fetched:', data);
      return data;
    },
    enabled: !!userId
  });

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', userProfile?.company_id, refreshTrigger],
    queryFn: async () => {
      console.log('Fetching team members, refresh trigger:', refreshTrigger);
      console.log('Company ID for fetch:', userProfile?.company_id);
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', userProfile?.company_id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Failed to load team members:', error);
          toast.error('Failed to load team members');
          throw error;
        }

        console.log('Fetched profiles:', profiles?.length || 0);
        console.log('Profile data:', profiles);
        return profiles as Profile[];
      } catch (fetchError) {
        console.error('Error in team members fetch function:', fetchError);
        toast.error('Error loading team members');
        return [];
      }
    },
    enabled: !!userProfile?.company_id,
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
    userProfile,
    isProfileLoading,
    teamMembers,
    isLoading,
    triggerRefresh,
    forceRefresh,
  };
};
