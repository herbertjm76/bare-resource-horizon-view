
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/logger';
import { useDemoAuth } from '@/hooks/useDemoAuth';

export const useTeamMembersRealtime = (
  companyId: string | undefined,
  onRefresh: () => void,
  onForceRefresh: () => void
) => {
  const { isDemoMode } = useDemoAuth();

  useEffect(() => {
    // Demo mode: no realtime subscriptions
    if (isDemoMode) return;

    if (!companyId) {
      logger.debug('No company ID provided for realtime subscription');

      // If no companyId is provided, try to get it from the current user's profile
      const fetchCompanyId = async () => {
        try {
          const { data } = await supabase.auth.getUser();
          if (!data || !data.user) {
            logger.error('No authenticated user found for realtime subscriptions');
            return;
          }

          // Query the profiles table directly
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', data.user.id)
            .single();

          if (profileError) {
            logger.error('Error fetching user company ID for realtime:', profileError);
            return;
          }

          if (profileData?.company_id) {
            logger.debug('Setting up realtime subscriptions for company from profile query:', profileData.company_id);
            setupSubscriptions(profileData.company_id);
          } else {
            logger.error('User has no company ID for realtime subscriptions');
          }
        } catch (error) {
          logger.error('Error in fetchCompanyId for realtime:', error);
        }
      };

      fetchCompanyId();
      return;
    }

    logger.debug('Setting up realtime subscriptions for company:', companyId);
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
              filter: `company_id=eq.${companyId}`,
            },
            (payload) => {
              logger.debug('Profiles change detected:', payload);
              onRefresh();
            }
          )
          .subscribe((status) => {
            logger.debug('Profiles subscription status:', status);
            if (status === 'SUBSCRIBED') {
              logger.debug('Successfully subscribed to profiles changes');
            } else if (status === 'TIMED_OUT') {
              logger.warn('Profiles subscription timed out, retrying...');
              // Don't show error toast for timeout - it's expected in some cases
            } else if (status === 'CHANNEL_ERROR') {
              logger.error('Error subscribing to profiles changes:', status);
              // Only show error for actual channel errors, not timeouts
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
              filter: `company_id=eq.${companyId}`,
            },
            (payload) => {
              logger.debug('Invites change detected:', payload);
              onRefresh();
            }
          )
          .subscribe((status) => {
            logger.debug('Invites subscription status:', status);
            if (status === 'SUBSCRIBED') {
              logger.debug('Successfully subscribed to invites changes');
            } else if (status === 'TIMED_OUT') {
              logger.warn('Invites subscription timed out, retrying...');
              // Don't show error toast for timeout - it's expected in some cases
            } else if (status === 'CHANNEL_ERROR') {
              logger.error('Error subscribing to invites changes:', status);
              // Only show error for actual channel errors, not timeouts
            }
          });

        // Cleanup
        return () => {
          logger.debug('Removing realtime subscriptions');
          supabase.removeChannel(profilesSubscription);
          supabase.removeChannel(invitesSubscription);
        };
      } catch (error) {
        logger.error('Error setting up realtime subscriptions:', error);
        toast.error('Failed to set up realtime updates');
        return () => {}; // Return empty cleanup function
      }
    }
  }, [companyId, onRefresh, isDemoMode]);

  return null;
};

