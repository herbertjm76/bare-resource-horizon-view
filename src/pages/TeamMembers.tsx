
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
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AuthGuard from '@/components/AuthGuard';

const HEADER_HEIGHT = 56;

const TeamMembersContent = () => {
  const navigate = useNavigate();
  const { checkUserPermissions, isChecking, hasPermission, permissionError } = useMemberPermissions();
  const [permissionChecked, setPermissionChecked] = useState(false);
  
  // Get user session
  const userId = useUserSession();
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  
  // Check permissions once when component mounts or userId changes
  useEffect(() => {
    const verifyAccess = async () => {
      if (!userId) {
        console.log('No user ID available, cannot check permissions');
        return;
      }
      
      console.log('Verifying access for user:', userId);
      const result = await checkUserPermissions();
      
      console.log('Permission check result:', result);
      setPermissionChecked(true);
      
      if (!result.hasPermission) {
        toast.error('You do not have permission to access this page');
      }
    };
    
    if (userId && !permissionChecked) {
      verifyAccess();
    }
  }, [userId, checkUserPermissions, permissionChecked]);
  
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

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
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
          
        if (error) {
          console.error('Profile fetch error:', error);
          throw error;
        }
        
        console.log('User profile loaded:', data);
        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }
    },
    enabled: !!userId && hasPermission,
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

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || isChecking;

  // Handle retry for permission errors
  const handleRetryPermission = async () => {
    setPermissionChecked(false);
    const result = await checkUserPermissions();
    
    if (result.hasPermission) {
      refetchProfile();
    }
  };

  // Show loading state
  if (isChecking && !permissionChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Show permission error state
  if (!hasPermission && permissionChecked) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access this page
            </AlertDescription>
          </Alert>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={handleRetryPermission}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 bg-background">
      <TeamMemberContent
        userProfile={userProfile}
        isProfileLoading={isLoading}
        teamMembers={teamMembers || []}
        onRefresh={triggerRefresh}
      />
    </div>
  );
};

const TeamMembersPage = () => {
  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="w-full min-h-screen flex flex-row">
          <div className="flex-shrink-0">
            <DashboardSidebar />
          </div>
          <div className="flex-1 flex flex-col">
            <AppHeader />
            <div style={{ height: HEADER_HEIGHT }} />
            <TeamMembersContent />
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default TeamMembersPage;
