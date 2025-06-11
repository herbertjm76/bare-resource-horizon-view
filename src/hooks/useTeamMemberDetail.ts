
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { toast } from 'sonner';

export const useTeamMemberDetail = (memberId: string | undefined) => {
  const [memberData, setMemberData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { company } = useCompany();

  useEffect(() => {
    const fetchMemberDetail = async () => {
      console.log('useTeamMemberDetail - memberId received:', memberId);
      console.log('useTeamMemberDetail - company:', company?.id);
      
      if (!memberId || !company?.id) {
        console.log('Missing memberId or company.id, stopping fetch');
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
        
        // Use a timeout for the query to prevent hanging
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );
        
        const queryPromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', memberId)
          .eq('company_id', company.id)
          .single();

        const { data: profile, error: profileError } = await Promise.race([
          queryPromise,
          timeoutPromise
        ]) as any;

        if (profileError) {
          console.error('Error fetching member profile:', profileError);
          if (profileError.code === 'PGRST116') {
            setError('Team member not found');
          } else {
            setError('Failed to load team member profile');
          }
          return;
        }

        if (!profile) {
          console.log('No profile found for member ID:', memberId);
          setError('Team member not found');
          return;
        }

        console.log('Successfully fetched member profile:', profile);
        setMemberData(profile);
      } catch (fetchError: any) {
        console.error('Error in fetchMemberDetail:', fetchError);
        if (fetchError.message === 'Request timeout') {
          setError('Request timed out. Please try refreshing the page.');
          toast.error('Request timed out. Please try refreshing the page.');
        } else {
          setError('An error occurred while loading team member details');
          toast.error('Failed to load team member details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberDetail();
  }, [memberId, company?.id]);

  return {
    memberData,
    isLoading,
    error
  };
};
