
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { AppHeader } from '@/components/AppHeader';
import { useCompany } from '@/context/CompanyContext';
import { OfficeSettingsProvider } from '@/context/officeSettings/OfficeSettingsContext';
import AuthGuard from '@/components/AuthGuard';

// Create a proper Profile type based on the database schema
type Profile = Database['public']['Tables']['profiles']['Row'];

const HEADER_HEIGHT = 56;

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const { company, isSubdomainMode } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    let authSubscription: { unsubscribe: () => void } | null = null;

    const setupAuth = async () => {
      try {
        console.log('Dashboard: Setting up auth');
        
        // First check for existing session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (!sessionData.session) {
          console.log('Dashboard: No session found, redirecting to login');
          if (mounted) {
            setLoading(false);
            navigate('/auth');
          }
          return;
        }
        
        if (mounted) {
          console.log('Dashboard: Session found, user is logged in:', sessionData.session.user.id);
          setSession(sessionData.session);
          setUser(sessionData.session.user);
        }

        // Then set up auth state change listener
        const { data } = supabase.auth.onAuthStateChange((event, currentSession) => {
          console.log('Dashboard: Auth state changed:', event);
          
          if (!mounted) return;
          
          // Set session data
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (event === 'SIGNED_OUT') {
            console.log('Dashboard: User signed out, redirecting');
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
      console.log('Dashboard: Cleaning up auth setup');
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

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
            : `https://${companyData.subdomain}.bareresource.com`;
          
          setInviteUrl(`${baseUrl}/join/invite-code-placeholder`);
        }
      }
    } catch (error) {
      console.error('Dashboard: Error fetching data:', error);
    }
  };

  const fetchTeamMembers = async (companyId: string) => {
    try {
      console.log('Dashboard: Fetching team members for company', companyId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Dashboard: Error fetching team members:', error);
        return;
      }

      console.log('Dashboard: Team members fetched:', data?.length || 0);
      setTeamMembers(data || []);
    } catch (error) {
      console.error('Dashboard: Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <OfficeSettingsProvider>
        <SidebarProvider>
          <div className="flex flex-col w-full min-h-screen bg-background">
            <div className="flex flex-1 w-full">
              <DashboardSidebar />
              <div className="flex-1 flex flex-col">
                <AppHeader />
                <div style={{ height: HEADER_HEIGHT }} />
                <div className="flex-1 bg-background">
                  <DashboardMetrics />
                </div>
              </div>
            </div>
          </div>
        </SidebarProvider>
      </OfficeSettingsProvider>
    </AuthGuard>
  );
};

export default Dashboard;
