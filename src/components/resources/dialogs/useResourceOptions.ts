
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import { useDemoAuth } from '@/hooks/useDemoAuth';
import { DEMO_TEAM_MEMBERS, DEMO_PRE_REGISTERED } from '@/data/demoData';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invite = Database['public']['Tables']['invites']['Row'];

export type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
  department?: string;
  location?: string;
  officeRoleId?: string | null;
};

export const useResourceOptions = () => {
  const [loading, setLoading] = useState(false);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const { company } = useCompany();
  const { isDemoMode } = useDemoAuth();
  
  useEffect(() => {
    // Demo mode: serve options from demo data (no Supabase).
    if (isDemoMode) {
      const formattedResources: ResourceOption[] = [
        ...DEMO_TEAM_MEMBERS.map((member) => ({
          id: member.id,
          name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
          email: member.email,
          type: 'active' as const,
          role: member.job_title || undefined,
          department: member.department || undefined,
          location: member.location || undefined,
          officeRoleId: member.office_role_id,
        })),
        ...DEMO_PRE_REGISTERED.map((invite) => ({
          id: invite.id,
          name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
          email: invite.email || '',
          type: 'pre-registered' as const,
          role: invite.job_title || undefined,
          department: invite.department || undefined,
          location: invite.location || undefined,
          officeRoleId: (invite as any).office_role_id ?? null,
        })),
      ];

      setResourceOptions(formattedResources);
      setLoading(false);
      return;
    }

    const fetchResources = async () => {
      if (!company?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch active team members using secure function that masks emails for non-admins
        const { data: activeMembers, error: activeError } = await supabase
          .rpc('get_profiles_secure', { p_company_id: company.id });
          
        if (activeError) throw activeError;
        
        // Fetch pre-registered team members from invites
        const { data: preregisteredMembers, error: inviteError } = await supabase
          .from('invites')
          .select('*')
          .eq('company_id', company.id)
          .eq('invitation_type', 'pre_registered')
          .eq('status', 'pending');
          
        if (inviteError) throw inviteError;
        
        // Combine and format the resources
        const formattedResources: ResourceOption[] = [
          // Active members
          ...(activeMembers || []).map((member: Profile) => ({
            id: member.id,
            name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || member.email,
            email: member.email,
            type: 'active' as const,
            role: member.job_title || undefined,
            department: member.department || undefined,
            location: member.location || undefined,
            officeRoleId: member.office_role_id
          })),
          
          // Pre-registered members
          ...(preregisteredMembers || []).map((invite: Invite) => ({
            id: invite.id,
            name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
            email: invite.email || '',
            type: 'pre-registered' as const,
            role: invite.job_title || undefined,
            department: invite.department || undefined,
            location: invite.location || undefined,
            officeRoleId: invite.office_role_id
          }))
        ];
        
        setResourceOptions(formattedResources);
      } catch (err: any) {
        console.error('Error fetching resources:', err);
        toast.error('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, [company, isDemoMode]);

  return {
    resourceOptions,
    loading
  };
};
