
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Profile, PendingMember, Invite, TeamMember } from '@/components/dashboard/types';
import { logger } from '@/utils/logger';

export const useTeamMembersState = (companyId: string | undefined, userRole: string) => {
  const [preRegisteredMembers, setPreRegisteredMembers] = useState<PendingMember[]>([]);
  const [emailInvites, setEmailInvites] = useState<Invite[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [isLoadingInvites, setIsLoadingInvites] = useState(false);

  // Fetch invites effect
  useEffect(() => {
    const fetchInvites = async () => {
      if (!companyId) {
        return;
      }
      
      setIsLoadingInvites(true);
      logger.log('Fetching invites - refresh flag:', refreshFlag);
      const { data: invites, error } = await supabase
        .from('invites')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (error) {
        toast.error('Failed to load invites');
        logger.error('Error fetching invites:', error);
        setIsLoadingInvites(false);
        return;
      }
      
      logger.log('Fetched invites:', invites?.length || 0, 'for company:', companyId);
      
      // Process ALL invites (both pre_registered and email_invite) as pending members
      const pendingMembers: PendingMember[] = (invites || []).map(invite => ({
        ...invite,
        isPending: true
      }));
      
      // Include both pre_registered AND email_invite types as pre-registered members
      const allPendingMembers = pendingMembers.filter(
        member => member.invitation_type === 'pre_registered' || member.invitation_type === 'email_invite'
      );
      logger.log('All pending members (pre_registered + email_invite):', allPendingMembers.length);
      
      setPreRegisteredMembers(allPendingMembers);
      setEmailInvites((invites || []).filter(invite => invite.invitation_type === 'email_invite'));
      setIsLoadingInvites(false);
    };
    
    if (companyId) {
      fetchInvites();
    }
  }, [companyId, userRole, refreshFlag]);

  const triggerRefresh = () => setRefreshFlag(prev => prev + 1);

  return {
    preRegisteredMembers,
    emailInvites,
    isLoadingInvites,
    refreshFlag,
    triggerRefresh,
    editMode,
    setEditMode,
    selectedMembers,
    setSelectedMembers
  };
};
