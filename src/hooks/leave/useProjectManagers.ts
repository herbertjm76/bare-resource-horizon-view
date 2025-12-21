import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface ProjectManager {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  avatar_url: string | null;
}

export const useProjectManagers = () => {
  const [projectManagers, setProjectManagers] = useState<ProjectManager[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useCompany();

  useEffect(() => {
    const fetchProjectManagers = async () => {
      if (!company?.id) return;

      setIsLoading(true);

      try {
        // Get users with project_manager role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id')
          .eq('company_id', company.id)
          .eq('role', 'project_manager');

        if (roleError) {
          console.error('Error fetching PM roles:', roleError);
          return;
        }

        if (!roleData || roleData.length === 0) {
          setProjectManagers([]);
          return;
        }

        const pmIds = roleData.map(r => r.user_id);

        // Fetch profiles for these users
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', pmIds);

        if (profileError) {
          console.error('Error fetching PM profiles:', profileError);
          return;
        }

        setProjectManagers(profiles || []);
      } catch (error) {
        console.error('Error in fetchProjectManagers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjectManagers();
  }, [company?.id]);

  return { projectManagers, isLoading };
};
