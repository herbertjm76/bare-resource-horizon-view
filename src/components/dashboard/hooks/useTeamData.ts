
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

      // Update Rob Night's avatar if he exists in the data
      const updatedMembersData = membersData?.map(member => {
        if (member.first_name === 'Rob' && member.last_name === 'Night') {
          return {
            ...member,
            avatar_url: '/lovable-uploads/a408b88c-6a1d-4e6d-aa32-a365c2c434ce.png'
          };
        }
        return member;
      }) || [];

      // Fetch pre-registered members from invites table
      const { data: invitesData, error: invitesError } = await supabase
        .from('invites')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .eq('invitation_type', 'pre_registered');

      if (invitesError) {
        console.error('Error fetching pre-registered members:', invitesError);
        throw invitesError;
      }

      console.log('Pre-registered members fetched:', invitesData?.length || 0);

      // Update Rob Night's avatar if he exists in the pre-registered data
      const updatedInvitesData = invitesData?.map(invite => {
        if (invite.first_name === 'Rob' && invite.last_name === 'Night') {
          return {
            ...invite,
            avatar_url: '/lovable-uploads/a408b88c-6a1d-4e6d-aa32-a365c2c434ce.png'
          };
        }
        return invite;
      }) || [];

      setTeamMembers(updatedMembersData);
      setPreRegisteredMembers(updatedInvitesData);
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
