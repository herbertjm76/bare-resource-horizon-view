
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { AppHeader } from '@/components/AppHeader';
import { useUserSession } from '@/hooks/useUserSession';
import { useTeamMembersData } from '@/hooks/useTeamMembersData';
import { useTeamMembersRealtime } from '@/hooks/useTeamMembersRealtime';
import { TeamMemberContent } from '@/components/dashboard/TeamMemberContent';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCompany } from '@/context/CompanyContext';
import { useMemberPermissions } from '@/hooks/team/useMemberPermissions';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const HEADER_HEIGHT = 56;

const TeamMembersPage = () => {
  const navigate = useNavigate();
  const { checkUserPermissions } = useMemberPermissions();
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  
  // Get user session
  const userId = useUserSession();
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  
  // Check permissions separately and early
  useEffect(() => {
    const verifyAccess = async () => {
      if (!userId) {
        setIsCheckingPermissions(false);
        return;
      }
      
      try {
        setIsCheckingPermissions(true);
        const hasPermission = await checkUserPermissions();
        
        if (!hasPermission) {
          console.log('User does not have permission to access team members page');
          navigate('/dashboard');
        }
        
        setIsCheckingPermissions(false);
      } catch (error) {
        console.error('Error verifying permissions:', error);
        setIsCheckingPermissions(false);
        navigate('/dashboard');
      }
    };
    
    verifyAccess();
  }, [userId, navigate, checkUserPermissions]);
  
  // Ensure company data is loaded
  useEffect(() => {
    if (!company && userId) {
      console.log('Company data missing, refreshing...');
      refreshCompany();
    }
  }, [company, userId, refreshCompany]);
  
  // Fetch team members data - passing false since we don't need inactive members here
  const {
    teamMembers,
    triggerRefresh,
    forceRefresh,
    isLoading: isTeamMembersLoading,
    error: teamMembersError
  } = useTeamMembersData(false);

  // Fetch user profile - direct query with no RPC
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log('Fetching user profile for ID:', userId);
      
      try {
        // Direct query to get user profile
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
          toast.error('Failed to load your profile');
          throw error;
        }
        
        if (!data) {
          console.warn('No profile found for user');
          return null;
        }
        
        console.log('User profile fetched successfully');
        return data;
      } catch (error) {
        console.error('Error in profile fetch:', error);
        return null;
      }
    },
    enabled: !!userId && !isCheckingPermissions,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: true, // Always refetch when the component mounts
  });

  // Set up realtime subscriptions
  useTeamMembersRealtime(
    userProfile?.company_id || company?.id,
    triggerRefresh,
    forceRefresh
  );
  
  // Show error message if there's an issue
  useEffect(() => {
    if (teamMembersError) {
      console.error('Team members error:', teamMembersError);
      toast.error('Failed to load team members data');
    }
    
    if (profileError) {
      console.error('Profile error:', profileError);
      toast.error('Failed to load your profile');
    }
  }, [teamMembersError, profileError]);

  // Log important state for debugging
  useEffect(() => {
    console.log('TeamMembers page - User ID:', userId);
    console.log('TeamMembers page - User profile:', userProfile);
    console.log('TeamMembers page - Company from context:', company);
    console.log('TeamMembers page - Team members count:', teamMembers?.length || 0);
  }, [userId, userProfile, company, teamMembers]);

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || isCheckingPermissions;

  // If still checking permissions, show a loading state
  if (isCheckingPermissions) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-4 sm:p-8 bg-background">
            <TeamMemberContent
              userProfile={userProfile}
              isProfileLoading={isLoading}
              teamMembers={teamMembers || []}
              onRefresh={triggerRefresh}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeamMembersPage;
