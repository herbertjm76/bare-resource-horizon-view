
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamMembersRealtime = (
  companyId: string | undefined,
  onRefresh: () => void,
  onForceRefresh: () => void
) => {
  useEffect(() => {
    if (!companyId) return;
    
    console.log('Setting up realtime subscriptions for company:', companyId);
    
    // Subscribe to changes on profiles table for this company
    const profilesSubscription = supabase
      .channel('team-members-profiles')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'profiles',
          filter: `company_id=eq.${companyId}` 
        }, 
        (payload) => {
          console.log('Profiles change detected:', payload);
          onRefresh();
        }
      )
      .subscribe((status) => {
        console.log('Profiles subscription status:', status);
      });
      
    // Subscribe to changes on invites table for this company  
    const invitesSubscription = supabase
      .channel('team-members-invites')
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invites',
          filter: `company_id=eq.${companyId}` 
        }, 
        (payload) => {
          console.log('Invites change detected:', payload);
          onRefresh();
        }
      )
      .subscribe((status) => {
        console.log('Invites subscription status:', status);
      });

    // Cleanup
    return () => {
      console.log('Removing realtime subscriptions');
      supabase.removeChannel(profilesSubscription);
      supabase.removeChannel(invitesSubscription);
    };
  }, [companyId, onRefresh]);

  return null;
};
