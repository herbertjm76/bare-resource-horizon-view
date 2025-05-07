
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
  const [permissionChecked, setPermissionChecked] = useState(false);
  
  // Get user session
  const userId = useUserSession();
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  
  // Check permissions only once to prevent multiple checks
  useEffect(() => {
    const verifyAccess = async () => {
      if (!userId || permissionChecked) {
        return;
      }
      
      try {
        setIsCheckingPermissions(true);
        console.log('Verifying access with userId:', userId);
        const hasPermission = await checkUserPermissions();
        
        if (!hasPermission) {
          console.log('Permission check failed, redirecting to dashboard');
          toast.error('You do not have permission to access this page');
          navigate('/dashboard');
          return;
        }
        
        setPermissionChecked(true);
      } catch (error) {
        console.error('Error verifying permissions:', error);
        toast.error('Failed to verify your permissions');
        navigate('/dashboard');
      } finally {
        setIsCheckingPermissions(false);
      }
    };
    
    if (userId) {
      verifyAccess();
    } else {
      setIsCheckingPermissions(false);
    }
  }, [userId, navigate, checkUserPermissions, permissionChecked]);
  
  // Ensure company data is loaded
  useEffect(() => {
    if (!company && userId) {
      refreshCompany();
    }
  }, [company, userId, refreshCompany]);
  
  // Fetch team members data - passing false since we don't need inactive members
  const {
    teamMembers,
    triggerRefresh,
    forceRefresh,
    isLoading: isTeamMembersLoading,
    error: teamMembersError
  } = useTeamMembersData(false);

  // Fetch user profile - simplified query to reduce potential errors
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError
  } = useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId && permissionChecked,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Set up realtime subscriptions only after permissions are confirmed
  useTeamMembersRealtime(
    userProfile?.company_id || company?.id,
    triggerRefresh,
    forceRefresh
  );
  
  // Show error message if there's an issue
  useEffect(() => {
    if (teamMembersError) {
      toast.error('Failed to load team members data');
    }
    
    if (profileError) {
      toast.error('Failed to load your profile');
    }
  }, [teamMembersError, profileError]);

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || isCheckingPermissions;

  // Show loading state
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

  // If not authenticated, the useUserSession hook will handle redirection
  if (!userId) {
    return null;
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
