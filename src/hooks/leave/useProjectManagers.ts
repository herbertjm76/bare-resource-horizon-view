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
        // Fetch actual users via RPC
        const { data: activeUsers, error: activeError } = await supabase.rpc('get_company_leave_approvers', {
          p_company_id: company.id
        });

        if (activeError) {
          console.error('Error fetching active approvers:', activeError);
        }

        // Fetch pending invites with approver roles
        const { data: pendingInvites, error: pendingError } = await supabase
          .from('invites')
          .select('id, first_name, last_name, email, avatar_url, role')
          .eq('company_id', company.id)
          .eq('status', 'pending')
          .in('role', ['owner', 'admin', 'project_manager']);

        if (pendingError) {
          console.error('Error fetching pending invites:', pendingError);
        }

        // Combine both lists and deduplicate by ID
        const combinedApprovers: Approver[] = [
          ...(activeUsers || []),
          ...(pendingInvites || []).map(invite => ({
            id: invite.id,
            first_name: invite.first_name,
            last_name: invite.last_name,
            email: invite.email,
            avatar_url: invite.avatar_url,
            role: invite.role || 'project_manager'
          }))
        ];

        // Deduplicate by ID (keep first occurrence)
        const uniqueApprovers = combinedApprovers.reduce((acc: Approver[], approver) => {
          if (!acc.find(a => a.id === approver.id)) {
            acc.push(approver);
          }
          return acc;
        }, []);

        // Sort alphabetically by name
        uniqueApprovers.sort((a, b) => {
          const nameA = `${a.first_name || ''} ${a.last_name || ''}`.toLowerCase().trim();
          const nameB = `${b.first_name || ''} ${b.last_name || ''}`.toLowerCase().trim();
          return nameA.localeCompare(nameB);
        });

        setProjectManagers(uniqueApprovers);
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
