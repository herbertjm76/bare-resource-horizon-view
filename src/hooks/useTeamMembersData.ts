
import { useCallback, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useTeamMembersData = (includeInactive: boolean = false) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { company, loading: companyLoading } = useCompany();

  // Fetch team members with refetch capability
  const {
    data: teamMembers = [],
    isLoading,
    error,
    refetch: refetchTeamMembers
  } = useQuery({
    queryKey: ['teamMembers', refreshTrigger, includeInactive, company?.id],
    queryFn: async () => {
      console.log('Fetching team members, refresh trigger:', refreshTrigger);
      console.log('Include inactive members:', includeInactive);
      console.log('Company ID from context:', company?.id);
      
      try {
        // First, get the current user's auth data
        const { data: authData } = await supabase.auth.getUser();
        if (!authData.user) {
          console.error('No authenticated user found');
          return [];
        }
        
        // Get the user's profile using the secure RPC function
        const { data: currentUserProfile, error: profileError } = await supabase
          .rpc('get_user_profile_by_id', { user_id: authData.user.id })
          .single();
          
        if (profileError) {
          console.error('Failed to get user profile:', profileError);
          toast.error('Failed to get user profile');
          throw profileError;
        }
        
        if (!currentUserProfile?.company_id) {
          console.error('User has no company associated');
          toast.error('No company associated with your account');
          return [];
        }
        
        console.log('User company ID:', currentUserProfile.company_id);
        console.log('User role:', currentUserProfile.role);
        
        // Now fetch all profiles from the same company
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', currentUserProfile.company_id);

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
    enabled: !companyLoading,
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
    isLoading: isLoading || companyLoading,
    error,
    triggerRefresh,
    forceRefresh,
  };
};
