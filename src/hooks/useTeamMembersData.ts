
import { useCallback, useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/components/dashboard/types";
import { toast } from "sonner";
import { useCompany } from '@/context/CompanyContext';

export const useTeamMembersData = (includeInactive: boolean = false) => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { company, loading: companyLoading } = useCompany();

  // Add more detailed logging
  useEffect(() => {
    console.log('useTeamMembersData - Company context:', company);
  }, [company]);

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
        
        // Get the user's company ID - first try from context
        let companyId = company?.id;
        
        if (!companyId) {
          // Since we can't use the RPC function directly, query the profiles table
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', authData.user.id)
            .single();
            
          if (profileError) {
            console.error('Failed to get user company ID:', profileError);
            toast.error('Failed to get company information');
            throw profileError;
          }
          
          companyId = profileData?.company_id;
          console.log('User company ID from query:', companyId);
        }
        
        if (!companyId) {
          console.error('Cannot fetch team members: No company ID available');
          toast.error('Company information not available');
          return [];
        }
        
        // Use direct query to get company members
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', companyId);

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
        throw fetchError;
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
    teamMembers: teamMembers || [],
    isLoading: isLoading || companyLoading,
    error,
    triggerRefresh,
    forceRefresh,
  };
};
