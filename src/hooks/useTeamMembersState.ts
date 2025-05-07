
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, PendingMember, Invite, TeamMember } from '@/components/dashboard/types';
import { useCompany } from '@/context/CompanyContext';

export const useTeamMembersState = (companyId: string | undefined, userRole: string) => {
  const [preRegisteredMembers, setPreRegisteredMembers] = useState<PendingMember[]>([]);
  const [emailInvites, setEmailInvites] = useState<Invite[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const { company } = useCompany();

  // Use company context as fallback if companyId is undefined
  const effectiveCompanyId = companyId || company?.id;

  // Fetch invites effect
  useEffect(() => {
    const fetchInvites = async () => {
      if (!effectiveCompanyId || !(userRole === 'owner' || userRole === 'admin')) {
        console.log('Cannot fetch invites: missing company ID or insufficient privileges');
        return;
      }
      
      console.log('Fetching invites - refresh flag:', refreshFlag, 'company ID:', effectiveCompanyId);
      const { data: invites, error } = await supabase
        .from('invites')
        .select('*')
        .eq('company_id', effectiveCompanyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Failed to load invites');
        console.error('Error fetching invites:', error);
        return;
      }
      
      console.log('Fetched invites:', invites?.length || 0);
      
      // Process invites into pendingMembers and emailInvites
      const pendingMembers: PendingMember[] = (invites || []).map(invite => ({
        ...invite,
        isPending: true
      }));
      
      setPreRegisteredMembers(pendingMembers.filter(member => member.invitation_type === 'pre_registered'));
      setEmailInvites((invites || []).filter(invite => invite.invitation_type === 'email_invite'));
    };
    
    if (effectiveCompanyId) {
      fetchInvites();
    }
  }, [effectiveCompanyId, userRole, refreshFlag]);

  const triggerRefresh = () => setRefreshFlag(prev => prev + 1);

  return {
    preRegisteredMembers,
    emailInvites,
    refreshFlag,
    triggerRefresh,
    editMode,
    setEditMode,
    selectedMembers,
    setSelectedMembers
  };
};
