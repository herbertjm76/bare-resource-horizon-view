
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/context/CompanyContext';
import type { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type Invite = Database['public']['Tables']['invites']['Row'];

export type ResourceOption = {
  id: string;
  name: string;
  email: string;
  type: 'active' | 'pre-registered';
  role?: string;
};

export const useResourceOptions = () => {
  const [loading, setLoading] = useState(false);
  const [resourceOptions, setResourceOptions] = useState<ResourceOption[]>([]);
  const { company } = useCompany();
  
  useEffect(() => {
    const fetchResources = async () => {
      if (!company?.id) return;
      
      try {
        setLoading(true);
        
        // Fetch active team members from profiles
        const { data: activeMembers, error: activeError } = await supabase
          .from('profiles')
          .select('*')
          .eq('company_id', company.id);
          
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
            role: member.job_title
          })),
          
          // Pre-registered members
          ...(preregisteredMembers || []).map((invite: Invite) => ({
            id: invite.id,
            name: `${invite.first_name || ''} ${invite.last_name || ''}`.trim() || invite.email,
            email: invite.email || '',
            type: 'pre-registered' as const,
            role: invite.job_title
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
  }, [company]);

  return {
    resourceOptions,
    loading
  };
};
