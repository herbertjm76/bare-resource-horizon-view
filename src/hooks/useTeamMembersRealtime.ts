
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useTeamMembersRealtime = (
  companyId: string | undefined,
  onRefresh: () => void,
  onForceRefresh: () => void
) => {
  useEffect(() => {
    if (!companyId) {
      // If no companyId is provided, try to get it from the current user's profile
      const fetchCompanyId = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('company_id')
          .eq('id', user.id)
          .single();
          
        if (profile?.company_id) {
          console.log('Setting up realtime subscriptions for company from profile:', profile.company_id);
          setupSubscriptions(profile.company_id);
        }
      };
      
      fetchCompanyId();
      return;
    }
    
    console.log('Setting up realtime subscriptions for company:', companyId);
    setupSubscriptions(companyId);
    
    function setupSubscriptions(companyId: string) {
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
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, onRefresh]);

  return null;
};
