
import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { ClipboardCopy, Users, LogOut, Settings, LineChart } from 'lucide-react';

interface Profile {
  id: string;
  company_id: string;
  role: 'owner' | 'admin' | 'member';
  first_name: string | null;
  last_name: string | null;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [teamMembers, setTeamMembers] = useState<Profile[]>([]);
  const [inviteUrl, setInviteUrl] = useState('');
  const { company } = useCompany();

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        fetchProfileData(session.user.id);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          fetchProfileData(session.user.id);
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch the user's profile data
  const fetchProfileData = async (userId: string) => {
    try {
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

      // If the user is an owner or admin, fetch team members
      if (data.role === 'owner' || data.role === 'admin') {
        fetchTeamMembers(data.company_id);
      }

      // Generate invite URL based on company subdomain
      if (data.company_id) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('subdomain')
          .eq('id', data.company_id)
          .single();

        if (companyData) {
          // In production, this would use the actual domain
          const baseUrl = window.location.hostname === 'localhost' 
            ? `http://localhost:${window.location.port}` 
            : `https://${companyData.subdomain}.bareresource.com`;
          
          setInviteUrl(`${baseUrl}/join/invite-code-placeholder`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Fetch team members for the company
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

  // Copy invite URL to clipboard
  const copyInviteUrl = () => {
    navigator.clipboard.writeText(inviteUrl);
    toast.success('Invite URL copied to clipboard!');
  };

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {company?.name || 'Your Company'} Dashboard
            </h1>
            <p className="text-white/80">
              Welcome, {profile?.first_name || user.email}
            </p>
          </div>
          <Button 
            variant="ghost"
            className="text-white hover:bg-white/10"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <LineChart className="mr-2 h-5 w-5" /> Projects
            </h2>
            <p className="text-white/80">Manage and track your unlimited projects</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Users className="mr-2 h-5 w-5" /> Team
            </h2>
            <p className="text-white/80">Collaborate with up to 50 team members</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="mr-2 h-5 w-5" /> Settings
            </h2>
            <p className="text-white/80">Customize your account and company settings</p>
          </div>
        </div>

        {/* Only show team management to owners and admins */}
        {profile?.role === 'owner' || profile?.role === 'admin' ? (
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Team Management</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium text-white mb-2">Invite Team Members</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  value={inviteUrl}
                  readOnly
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none"
                />
                <Button onClick={copyInviteUrl} variant="secondary">
                  <ClipboardCopy className="mr-2 h-4 w-4" /> Copy
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Team Members ({teamMembers.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="py-2 px-4 text-left text-white/80">Name</th>
                      <th className="py-2 px-4 text-left text-white/80">Email</th>
                      <th className="py-2 px-4 text-left text-white/80">Role</th>
                      <th className="py-2 px-4 text-left text-white/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">
                          {member.first_name && member.last_name 
                            ? `${member.first_name} ${member.last_name}`
                            : 'No name provided'}
                        </td>
                        <td className="py-3 px-4 text-white">{member.email}</td>
                        <td className="py-3 px-4 text-white capitalize">{member.role}</td>
                        <td className="py-3 px-4">
                          {profile?.role === 'owner' && (
                            <Button variant="ghost" size="sm" className="text-white">
                              Manage
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
