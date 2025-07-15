import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamCompositionData = (companyId?: string) => {
  const [teamComposition, setTeamComposition] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!companyId) {
      setIsLoading(false);
      return;
    }

    const fetchTeamComposition = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('project_team_composition')
          .select('*')
          .eq('company_id', companyId);

        if (error) {
          console.error('Error fetching team composition:', error);
          setTeamComposition([]);
        } else {
          setTeamComposition(data || []);
        }
      } catch (error) {
        console.error('Error fetching team composition:', error);
        setTeamComposition([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamComposition();
  }, [companyId]);

  return {
    teamComposition,
    isLoading
  };
};