
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
      if (!memberId || !company?.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch the team member profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', memberId)
          .eq('company_id', company.id)
          .single();

        if (profileError) {
          console.error('Error fetching member profile:', profileError);
          setError('Failed to load team member profile');
          return;
        }

        if (!profile) {
          setError('Team member not found');
          return;
        }

        setMemberData(profile);
      } catch (fetchError) {
        console.error('Error in fetchMemberDetail:', fetchError);
        setError('An error occurred while loading team member details');
        toast.error('Failed to load team member details');
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
