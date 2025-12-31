
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { logger } from '@/utils/logger';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useDashboardAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const navigate = useNavigate();

  const fetchProfileData = async (userId: string) => {
    try {
      logger.debug('Dashboard: Fetching profile data for user', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        logger.error('Dashboard: Error fetching profile:', error);
        return;
      }

      logger.debug('Dashboard: Profile data fetched:', data);
      setProfile(data);

      // Check if user is admin using secure RPC
      const { data: isAdmin } = await supabase.rpc('user_is_admin_safe');
      if (isAdmin && data.company_id) {
        fetchTeamMembers(data.company_id);
      }

      if (data.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('subdomain')
          .eq('id', data.company_id)
          .single();

        if (companyData) {
          const baseUrl = window.location.hostname === 'localhost' 
            ? `http://localhost:${window.location.port}` 
            : `https://bareresource.com`;
          
          setInviteUrl(`${baseUrl}/join/${companyData.subdomain}/invite-code-placeholder`);
        }
      }
    } catch (error) {
      console.error('Dashboard: Error fetching data:', error);
    }
  };

  const fetchTeamMembers = async (companyId: string) => {
    try {
      logger.debug('Dashboard: Fetching team members for company', companyId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        logger.error('Dashboard: Error fetching team members:', error);
        return;
      }

      logger.debug('Dashboard: Team members fetched:', data?.length || 0);
      setTeamMembers(data || []);
    } catch (error) {
      logger.error('Dashboard: Error:', error);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const setupAuth = async () => {
      try {
        logger.debug('Dashboard: Setting up auth');
        
        // First check for existing session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          logger.debug('Dashboard: No session found, redirecting to login');
          if (mounted) {
            setLoading(false);
            navigate('/auth');
          }
          return;
        }
        
        if (mounted) {
          logger.debug('Dashboard: Session found, user is logged in:', sessionData.session.user.id);
          setSession(sessionData.session);
          setUser(sessionData.session.user);
        }

        // Then set up auth state change listener
        const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
          logger.debug('Dashboard: Auth state changed:', event);
          
          if (!mounted) return;
          
          // Set session data
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            logger.debug('Dashboard: User signed out, redirecting');
            navigate('/auth');
          }
        });

        authSubscription = data.subscription;

        if (sessionData.session?.user && mounted) {
          await fetchProfileData(sessionData.session.user.id);
        }
        
        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error('Dashboard: Auth setup error:', error);
        if (mounted) {
          setLoading(false);
          navigate('/auth');
        }
      }
    };

    setupAuth();
    
    // Cleanup function
    return () => {
      logger.debug('Dashboard: Cleaning up auth setup');
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  return {
    user,
    session,
    loading,
    profile,
    teamMembers,
    inviteUrl
  };
};
