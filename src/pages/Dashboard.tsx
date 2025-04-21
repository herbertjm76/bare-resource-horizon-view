import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TeamManagement } from '@/components/dashboard/TeamManagement';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { AppHeader } from '@/components/AppHeader';

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
  const navigate = useNavigate();

  useEffect(() => {
    // Check current session and set up auth state change listener
    const setupAuth = async () => {
      try {
        // Set up auth state listener FIRST to prevent missing auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          setUser(session?.user ?? null);
          
          if (!session && event === 'SIGNED_OUT') {
            navigate('/auth');
          }
        });

        // THEN check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfileData(session.user.id);
        }
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth setup error:', error);
        setLoading(false);
      }
    };

    setupAuth();
  }, [navigate]);

  const fetchProfileData = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

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
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', companyId);

      if (error) {
        console.error('Error fetching team members:', error);
        return;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      {/* Glassmorphism header, always present */}
      <AppHeader />
      <div className="flex flex-col w-full min-h-screen">
        {/* Spacer for fixed header */}
        <div style={{ height: HEADER_HEIGHT }} />
        <div className="flex flex-1 w-full">
          {/* Sidebar now starts below the glass header */}
          <DashboardSidebar />
          <div className="flex-1 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-8">
            <div className="max-w-6xl mx-auto">
              <DashboardHeader userName={profile?.first_name || user.email?.split('@')[0] || 'User'} />
              <DashboardMetrics />
              {(profile?.role === 'owner' || profile?.role === 'admin') && (
                <TeamManagement 
                  teamMembers={teamMembers} 
                  inviteUrl={inviteUrl}
                  userRole={profile.role}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
