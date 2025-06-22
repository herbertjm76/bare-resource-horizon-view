
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
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .eq('invitation_type', 'pre_registered');

      if (invitesError) {
        console.error('Error fetching pre-registered members:', invitesError);
        throw invitesError;
      }

      console.log('Pre-registered members fetched:', invitesData?.length || 0);
      
      // SUPER DETAILED logging for ALL pre-registered members
      console.log('🔍 DETAILED pre-registered members analysis:');
      invitesData?.forEach((member, index) => {
        console.log(`--- Member ${index + 1} ---`);
        console.log('ID:', member.id);
        console.log('Name:', member.first_name, member.last_name);
        console.log('Email:', member.email);
        console.log('Avatar URL:', member.avatar_url);
        console.log('Avatar URL type:', typeof member.avatar_url);
        console.log('Avatar URL length:', member.avatar_url?.length);
        console.log('All keys:', Object.keys(member));
        console.log('Full object:', JSON.stringify(member, null, 2));
      });
      
      // Specific check for Jingjing Kim
      const jingjingInvite = invitesData?.find(m => 
        m.first_name?.toLowerCase().includes('jingjing') || 
        m.first_name?.toLowerCase().includes('jing')
      );
      
      if (jingjingInvite) {
        console.log('🎯 FOUND Jingjing in data - DETAILED ANALYSIS:');
        console.log('- Exact first_name:', `"${jingjingInvite.first_name}"`);
        console.log('- Exact last_name:', `"${jingjingInvite.last_name}"`);
        console.log('- Exact avatar_url:', `"${jingjingInvite.avatar_url}"`);
        console.log('- Avatar URL exists:', !!jingjingInvite.avatar_url);
        console.log('- Avatar URL is string:', typeof jingjingInvite.avatar_url === 'string');
        console.log('- Raw JSON:', JSON.stringify(jingjingInvite));
      } else {
        console.log('❌ Jingjing NOT found in pre-registered data');
        console.log('Available first names:', invitesData?.map(m => `"${m.first_name}"`));
      }

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
