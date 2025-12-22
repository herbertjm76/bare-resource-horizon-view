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
  isPending?: boolean;
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
        // Fetch active users with owner, admin, or project_manager roles
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('company_id', company.id)
          .in('role', ['owner', 'admin', 'project_manager']);

        // Fetch pending invites with approver roles
        const { data: pendingInvites, error: inviteError } = await supabase
          .from('invites')
          .select('id, first_name, last_name, email, avatar_url, role')
          .eq('company_id', company.id)
          .eq('status', 'pending')
          .in('role', ['owner', 'admin', 'project_manager']);

        if (roleError) {
          console.error('Error fetching approver roles:', roleError);
        }

        if (inviteError) {
          console.error('Error fetching pending invites:', inviteError);
        }

        const approvers: Approver[] = [];

        // Process active users
        if (roleData && roleData.length > 0) {
          // Get unique user IDs (a user might have multiple roles)
          const userRoleMap = new Map<string, string>();
          roleData.forEach(r => {
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
          } else if (profiles) {
            profiles.forEach(profile => {
              approvers.push({
                ...profile,
                role: userRoleMap.get(profile.id) || 'project_manager',
                isPending: false
              });
            });
          }
        }

        // Add pending invites
        if (pendingInvites && pendingInvites.length > 0) {
          pendingInvites.forEach(invite => {
            approvers.push({
              id: invite.id,
              first_name: invite.first_name,
              last_name: invite.last_name,
              email: invite.email,
              avatar_url: invite.avatar_url,
              role: invite.role || 'project_manager',
              isPending: true
            });
          });
        }

        // Sort alphabetically by name
        approvers.sort((a, b) => {
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().trim();
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase().trim();
          return nameA.localeCompare(nameB);
        });

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
