
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyId } from '@/hooks/useCompanyId';
import { toast } from 'sonner';

export const useTeamMemberDetail = (memberId: string | undefined) => {
  const [memberData, setMemberData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { companyId } = useCompanyId();

  useEffect(() => {
    const fetchMemberDetail = async () => {
      console.log('useTeamMemberDetail - memberId received:', memberId);
      console.log('useTeamMemberDetail - company:', companyId);
      
      if (!memberId || !companyId) {
        console.log('Missing memberId or companyId, stopping fetch');
        setIsLoading(false);
        return;
      }

      // Validate that memberId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(memberId)) {
        console.error('Invalid UUID format for memberId:', memberId);
        setError('Invalid member ID format');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching member profile for ID:', memberId);
        
        // First, try to get the active profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', memberId)
          .eq('company_id', companyId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching member profile:', profileError);
          setError('Failed to load team member profile');
          return;
        }

        if (profile) {
          console.log('Successfully fetched member profile:', profile);
          setMemberData(profile);
          return;
        }

        // If no profile found, check if this is a pre-registered invite
        console.log('No profile found, checking invites table...');
        const { data: invite, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('id', memberId)
          .eq('company_id', companyId)
          .eq('invitation_type', 'pre_registered')
          .maybeSingle();

        if (inviteError) {
          console.error('Error checking invites:', inviteError);
          setError('Team member not found');
          return;
        }

        if (invite) {
          console.log('Found pre-registered invite:', invite);
          setError('This team member has not yet activated their account. They are still in pre-registered status.');
          return;
        }

        // Neither profile nor invite found
        console.log('No profile or invite found for member ID:', memberId);
        setError('Team member not found');
        
      } catch (fetchError: any) {
        console.error('Error in fetchMemberDetail:', fetchError);
        setError('An error occurred while loading team member details');
        toast.error('Failed to load team member details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId, companyId]);

  return {
    memberData,
    isLoading,
    error
  };
};
