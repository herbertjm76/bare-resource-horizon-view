
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useTeamMembersRealtime = (
  companyId: string | undefined,
  onRefresh: () => void,
  onForceRefresh: () => void
) => {
  useEffect(() => {
    if (!companyId) {
      console.log('No company ID provided for realtime subscription');
      
      // If no companyId is provided, try to get it from the current user's profile using the RPC
      const fetchCompanyId = async () => {
        try {
          const { data } = await supabase.auth.getUser();
          if (!data || !data.user) {
            console.error('No authenticated user found for realtime subscriptions');
            return;
          }
          
          // Use the RPC function to get the company safely
          const { data: companyIdData, error: companyIdError } = await supabase
            .rpc('get_user_company_id', { user_id: data.user.id });
            
          if (companyIdError) {
            console.error('Error fetching user company ID for realtime:', companyIdError);
            return;
          }
          
          if (companyIdData) {
            console.log('Setting up realtime subscriptions for company from RPC:', companyIdData);
            setupSubscriptions(companyIdData);
          } else {
            console.error('User has no company ID for realtime subscriptions');
          }
        } catch (error) {
          console.error('Error in fetchCompanyId for realtime:', error);
        }
      };
      
      fetchCompanyId();
      return;
    }
    
    console.log('Setting up realtime subscriptions for company:', companyId);
    return setupSubscriptions(companyId);
    
    function setupSubscriptions(companyId: string) {
      try {
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
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to profiles changes');
            } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
              console.error('Error subscribing to profiles changes:', status);
              toast.error('Failed to subscribe to team member updates');
            }
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
            if (status === 'SUBSCRIBED') {
              console.log('Successfully subscribed to invites changes');
            } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
              console.error('Error subscribing to invites changes:', status);
              toast.error('Failed to subscribe to invite updates');
            }
          });
    
        // Cleanup
        return () => {
          console.log('Removing realtime subscriptions');
          supabase.removeChannel(profilesSubscription);
          supabase.removeChannel(invitesSubscription);
        };
      } catch (error) {
        console.error('Error setting up realtime subscriptions:', error);
        toast.error('Failed to set up realtime updates');
        return () => {}; // Return empty cleanup function
      }
    }
    
  }, [companyId, onRefresh]);

  return null;
};
