
import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export const useTeamMembersRealtime = (
  companyId: string | undefined,
  triggerRefresh: () => void,
  forceRefresh: () => void
) => {
  useEffect(() => {
    if (!companyId) return;
    
    console.log('Setting up realtime subscription for company:', companyId);
    
    // Separate channel for profiles table
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: `company_id=eq.${companyId}`
      }, (payload) => {
        console.log('Detected change in profiles table:', payload);
        
        // If this is an update operation, log the new data
        if (payload.eventType === 'UPDATE') {
          console.log('Profile updated:', payload.new);
        }
        
        triggerRefresh();
      })
      .subscribe((status) => {
        console.log('Profiles subscription status:', status);
      });
      
    // Separate channel for invites table  
    const invitesChannel = supabase
      .channel('invites-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'invites',
        filter: `company_id=eq.${companyId}`
      }, (payload) => {
        console.log('Detected change in invites table:', payload);
        
        // If this is an update operation, log the new data
        if (payload.eventType === 'UPDATE') {
          console.log('Invite updated:', payload.new);
        }
        
        triggerRefresh();
      })
      .subscribe((status) => {
        console.log('Invites subscription status:', status);
      });
      
    // Add a debug button to the console for troubleshooting
    if (typeof window !== 'undefined') {
      (window as any).forceTeamMembersRefresh = forceRefresh;
      console.log('Debug function added to window: forceTeamMembersRefresh()');
    }
      
    return () => {
      console.log('Cleaning up realtime subscriptions');
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(invitesChannel);
      
      if (typeof window !== 'undefined') {
        delete (window as any).forceTeamMembersRefresh;
      }
    };
  }, [companyId, triggerRefresh, forceRefresh]);
};
