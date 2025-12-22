import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';

interface Approver {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
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
        // Get users with owner, admin, or project_manager roles (these can approve leave)
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('company_id', company.id)
          .in('role', ['owner', 'admin', 'project_manager']);

        if (roleError) {
          console.error('Error fetching approver roles:', roleError);
          return;
        }

        if (!roleData || roleData.length === 0) {
          setProjectManagers([]);
          return;
        }

        // Get unique user IDs (a user might have multiple roles)
        const userRoleMap = new Map<string, string>();
        roleData.forEach(r => {
          // Keep the highest role (owner > admin > project_manager)
          const existingRole = userRoleMap.get(r.user_id);
          if (!existingRole || getRolePriority(r.role) > getRolePriority(existingRole)) {
            userRoleMap.set(r.user_id, r.role);
          }
        });

        const approverIds = Array.from(userRoleMap.keys());

        // Fetch profiles for these users
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, email, avatar_url')
          .in('id', approverIds);

        if (profileError) {
          console.error('Error fetching approver profiles:', profileError);
          return;
        }

        // Combine profile data with role info
        const approvers: Approver[] = (profiles || []).map(profile => ({
          ...profile,
          role: userRoleMap.get(profile.id) || 'project_manager'
        }));

        // Sort by role priority (owner first, then admin, then PM)
        approvers.sort((a, b) => getRolePriority(b.role) - getRolePriority(a.role));

        setProjectManagers(approvers);
      } catch (error) {
        console.error('Error in fetchApprovers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApprovers();
  }, [company?.id]);

  return { projectManagers, isLoading };
};

// Helper to determine role priority
function getRolePriority(role: string): number {
  switch (role) {
    case 'owner': return 3;
    case 'admin': return 2;
    case 'project_manager': return 1;
    default: return 0;
  }
}
