import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { useDemoAuth } from './useDemoAuth';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const useEnhancedDashboardAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const navigate = useNavigate();
  
  const demoAuth = useDemoAuth();

  const fetchProfileData = async (userId: string) => {
    try {
      console.log('Dashboard: Fetching profile data for user', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Dashboard: Error fetching profile:', error);
        return;
      }

      console.log('Dashboard: Profile data fetched:', data);
      setProfile(data);

      if (data.role === 'owner' || data.role === 'admin') {
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
            : `https://${window.location.hostname}`;
          setInviteUrl(`${baseUrl}/auth?company=${companyData.subdomain}`);
        }
      }
    } catch (error) {
      console.error('Dashboard: Error in fetchProfileData:', error);
    }
  };

  const fetchTeamMembers = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Dashboard: Error fetching team members:', error);
        return;
      }

      console.log('Dashboard: Team members fetched:', data);
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Dashboard: Error in fetchTeamMembers:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // If in demo mode, use demo auth
        if (demoAuth.isDemoMode) {
          setUser(demoAuth.user);
          setSession(demoAuth.session);
          setProfile(demoAuth.profile);
          setTeamMembers(demoAuth.teamMembers);
          setInviteUrl(demoAuth.inviteUrl);
          setLoading(false);
          return;
        }

        console.log('Dashboard: Initializing authentication...');
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Dashboard: Auth state changed:', event, session?.user?.id);
            
            setSession(session);
            setUser(session?.user ?? null);
            
            if (event === 'SIGNED_OUT' || !session) {
              console.log('Dashboard: User signed out, redirecting to auth...');
              setProfile(null);
              setTeamMembers([]);
              setInviteUrl('');
              navigate('/auth');
            } else if (event === 'SIGNED_IN' && session?.user) {
              console.log('Dashboard: User signed in, fetching profile...');
              await fetchProfileData(session.user.id);
            }
            
            setLoading(false);
          }
        );

        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          console.log('Dashboard: Found initial session');
          setSession(initialSession);
          setUser(initialSession.user);
          await fetchProfileData(initialSession.user.id);
        } else {
          console.log('Dashboard: No initial session, redirecting to auth...');
          navigate('/auth');
        }
        
        setLoading(false);

        return () => {
          console.log('Dashboard: Cleaning up auth subscription');
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Dashboard: Error initializing auth:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [navigate, demoAuth.isDemoMode]);

  return { 
    user, 
    session, 
    loading, 
    profile, 
    teamMembers, 
    inviteUrl,
    isDemoMode: demoAuth.isDemoMode
  };
};