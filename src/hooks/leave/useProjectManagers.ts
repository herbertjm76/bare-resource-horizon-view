import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface Approver {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  role: string;
}

export const useProjectManagers = () => {
  const [projectManagers, setProjectManagers] = useState<Approver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    const fetchApprovers = async () => {
      if (!company?.id) return;

      setIsLoading(true);

      try {
        // Use server-side function that only returns actual users (excludes pending invites)
        const { data, error } = await supabase.rpc('get_company_leave_approvers', {
          p_company_id: company.id
        });

        if (error) {
          console.error('Error fetching approvers:', error);
          setProjectManagers([]);
        } else {
          setProjectManagers(data || []);
        }
      } catch (error) {
        console.error('Error in fetchApprovers:', error);
        setProjectManagers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovers();
  }, [company?.id]);

  return { projectManagers, isLoading };
};
