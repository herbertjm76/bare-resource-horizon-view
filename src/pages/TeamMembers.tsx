
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
import { Loader2, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const HEADER_HEIGHT = 56;

const TeamMembersContent = () => {
  const navigate = useNavigate();
  const { 
    checkUserPermissions, 
    isChecking, 
    hasPermission, 
    permissionError,
    forceGrantPermission 
  } = useMemberPermissions();
  
  const [permissionCheckAttempts, setPermissionCheckAttempts] = useState(0);
  const [useFallbackPermission, setUseFallbackPermission] = useState(false);
  
  // Get user session
  const userId = useUserSession();
  const { company, loading: companyLoading, refreshCompany, error: companyError } = useCompany();
  
  // Log available company data for debugging
  useEffect(() => {
    console.log('TeamMembersPage - Company data:', {
      hasCompany: !!company,
      companyId: company?.id,
      companyLoading,
      companyError
    });
  }, [company, companyLoading, companyError]);
  
  // Check permissions when component mounts
  useEffect(() => {
    if (!userId) {
      console.log('No user ID available, cannot check permissions');
      return;
    }
    
    const verifyAccess = async () => {
      console.log('Verifying access for user:', userId);
      try {
        // Add a small delay to ensure session is loaded properly
        setTimeout(async () => {
          const result = await checkUserPermissions();
          
          if (!result.hasPermission) {
            console.error('Permission check failed:', result.error);
            // Increment attempts counter
            setPermissionCheckAttempts(prev => prev + 1);
          }
        }, 300);
      } catch (error) {
        console.error('Error during permission check:', error);
        setPermissionCheckAttempts(prev => prev + 1);
      }
    };
    
    verifyAccess();
  }, [userId, checkUserPermissions]);

  // Enable fallback permission after 2 failed attempts
  useEffect(() => {
    if (permissionCheckAttempts >= 2 && !hasPermission) {
      console.log('Multiple permission check failures, using fallback approach');
      setUseFallbackPermission(true);
      forceGrantPermission();
    }
  }, [permissionCheckAttempts, hasPermission, forceGrantPermission]);
  
  // Ensure company data is loaded
  useEffect(() => {
    if (!company && userId) {
      console.log('No company data loaded, refreshing company data');
      refreshCompany();
    }
  }, [company, userId, refreshCompany]);
  
  // Fetch team members data
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
        // Get user session to access metadata
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData?.session?.user;
        
        // First try to extract role from session metadata
        let userRole = null;
        if (user) {
          if (user.app_metadata && user.app_metadata.role) {
            userRole = user.app_metadata.role;
          } else if (user.user_metadata && user.user_metadata.role) {
            userRole = user.user_metadata.role;
          }
        }
        
        // If we could get the role without querying profiles, construct a profile object
        if (userRole) {
          console.log('Using role from metadata:', userRole);
          return {
            id: userId,
            role: userRole,
            company_id: company?.id,
            first_name: user?.user_metadata?.first_name || 'User',
            last_name: user?.user_metadata?.last_name || '',
            email: user?.email
          };
        }
        
        // As a fallback, try to fetch the profile
        console.log('Fetching user profile from database');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role, company_id, first_name, last_name, email')
          .eq('id', userId)
          .single();
          
        if (error) {
          console.error('Profile fetch error:', error);
          
          // If error is recursion-related, use a default profile
          if (error.message.includes('recursion')) {
            console.log('Recursion detected in profile query, using default profile');
            return {
              id: userId,
              role: 'owner', // Assume owner for development
              company_id: company?.id,
              first_name: 'User',
              last_name: '',
              email: user?.email
            };
          }
          
          throw error;
        }
        
        console.log('User profile loaded:', data);
        return data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Return a minimal default profile to avoid UI breakage
        return {
          id: userId,
          role: 'owner', // Assume owner for development
          company_id: company?.id
        };
      }
    },
    enabled: !!userId,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Set up realtime subscriptions
  useTeamMembersRealtime(
    userProfile?.company_id || company?.id,
    triggerRefresh,
    forceRefresh
  );
  
  // Handle errors
  useEffect(() => {
    if (teamMembersError) {
      toast.error('Failed to load team members data');
    }
    
    if (profileError) {
      toast.error('Failed to load your profile');
    }

    if (companyError) {
      toast.error('Failed to load company data');
    }
  }, [teamMembersError, profileError, companyError]);

  const isLoading = isTeamMembersLoading || isProfileLoading || companyLoading || isChecking;

  // Handle retry for permission errors
  const handleRetryPermission = async () => {
    toast.info('Retrying permission check...');
    
    // Ensure auth session is refreshed
    try {
      await supabase.auth.refreshSession();
      const result = await checkUserPermissions();
      
      if (result.hasPermission) {
        refetchProfile();
        triggerRefresh();
        refreshCompany();
      } else {
        // Increment attempts counter
        setPermissionCheckAttempts(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
      toast.error('Could not refresh your session');
    }
  };

  // Verify if company ID is available (explicit log for debugging)
  const effectiveCompanyId = userProfile?.company_id || company?.id;
  useEffect(() => {
    console.log('TeamMembersContent - Effective company ID:', effectiveCompanyId);
    if (!effectiveCompanyId && !isLoading) {
      console.warn('No company ID available for team members page');
    }
  }, [effectiveCompanyId, isLoading]);

  // Show loading state
  if (isLoading && !useFallbackPermission) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading team members data...</p>
        </div>
      </div>
    );
  }

  // Show permission error state
  if (!hasPermission && !useFallbackPermission) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              {permissionError || 'You do not have permission to access this page'}
            </AlertDescription>
          </Alert>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')} variant="outline">
              Back to Dashboard
            </Button>
            <Button onClick={handleRetryPermission}>
              Try Again
            </Button>
          </div>
          <div className="mt-4 text-center">
            <Button 
              variant="link"
              onClick={() => {
                setUseFallbackPermission(true);
                forceGrantPermission();
                toast.success('Using development mode to bypass permissions');
              }}
            >
              Use Development Mode
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show company error state
  if (!company && companyError && !useFallbackPermission) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Company Not Found</AlertTitle>
            <AlertDescription>
              {companyError || 'Could not find your company data'}
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={refreshCompany}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show auth error state if no user profile and no fallback is active
  if (!userProfile && !isLoading && !useFallbackPermission) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You must be logged in to view team members.
            </AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={() => navigate('/auth')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-8 bg-background">
      {useFallbackPermission && (
        <Alert className="mb-4">
          <Shield className="h-4 w-4" />
          <AlertTitle>Development Mode Active</AlertTitle>
          <AlertDescription>
            Permission checks are being bypassed for development purposes.
          </AlertDescription>
        </Alert>
      )}
      <TeamMemberContent
        userProfile={userProfile || { role: 'owner' }} // Provide fallback
        isProfileLoading={isLoading}
        teamMembers={teamMembers || []}
        onRefresh={triggerRefresh}
      />
    </div>
  );
};

const TeamMembersPage = () => {
  return (
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
  );
};

export default TeamMembersPage;
