
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTeamData = (companyId?: string) => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [preRegisteredMembers, setPreRegisteredMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTeamData = useCallback(async () => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      console.log('Fetching team data for company:', companyId);

      // Fetch team members from profiles table only
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (membersError) {
        console.error('Error fetching team members:', membersError);
        throw membersError;
      }

      console.log('Team members fetched:', membersData?.length || 0);

      // Fetch pre-registered members from invites table with avatar_url
      const { data: invitesData, error: invitesError } = await supabase
        .from('invites')
        .select('*, avatar_url')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .eq('invitation_type', 'pre_registered');

      if (invitesError) {
        console.error('Error fetching pre-registered members:', invitesError);
        throw invitesError;
      }

      console.log('Pre-registered members fetched:', invitesData?.length || 0);
      console.log('Pre-registered members with avatars:', invitesData?.map(m => ({ name: `${m.first_name} ${m.last_name}`, avatar_url: m.avatar_url })));

      setTeamMembers(membersData || []);
      setPreRegisteredMembers(invitesData || []);
    } catch (error) {
      console.error('Error fetching team data:', error);
      toast.error('Failed to load team data');
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchTeamData();
  }, [fetchTeamData]);

  return {
    teamMembers,
    preRegisteredMembers,
    isLoading,
    refetch: fetchTeamData
  };
};
