
import React, { useEffect, useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folder, Layers, MapPin, Briefcase, Currency, Calendar, AlertCircle, RefreshCw, Loader2 } from 'lucide-react';
import { CountriesTab } from '@/components/settings/CountriesTab';
import { StagesTab } from '@/components/settings/StagesTab';
import { LocationsTab } from '@/components/settings/LocationsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RatesTab } from '@/components/settings/RatesTab';
import { HolidaysTab } from '@/components/settings/HolidaysTab';
import { OfficeSettingsProvider } from '@/context/OfficeSettingsContext';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '@/context/CompanyContext';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const tabBarClass =
  "w-full mb-4 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-6 gap-1 flex-nowrap rounded-none bg-transparent p-0";

const HEADER_HEIGHT = 56;

const OfficeSettings = () => {
  const { company, loading: companyLoading, refreshCompany } = useCompany();
  const navigate = useNavigate();
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  // Check authentication status
  useEffect(() => {
    let mounted = true;
    let authTimeout: NodeJS.Timeout | null = null;
    
    console.log('OfficeSettings page mounted', { 
      hasCompany: !!company, 
      companyLoading 
    });
    
    // Set a safety timeout
    authTimeout = setTimeout(() => {
      if (mounted) {
        console.log('Auth check timed out');
        setIsAuthenticating(false);
        setAuthError('Authentication check timed out. Please try refreshing.');
      }
    }, 5000);
    
    const checkAuth = async () => {
      try {
        // Check if there's a session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (!session) {
          console.log('No active session, redirecting to auth page');
          navigate('/auth');
          return;
        }
        
        // Session exists, check the user's role
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (profileError) throw profileError;
        
        if (!profile) {
          console.log('Profile not found');
          setUserRole(null);
        } else {
          console.log('User role:', profile.role);
          setUserRole(profile.role);
          
          // Check if user has required role for office settings
          if (profile.role !== 'owner' && profile.role !== 'admin') {
            console.log('User does not have required role');
            toast.error('You do not have permission to access this page');
            navigate('/dashboard');
            return;
          }
        }
        
        if (mounted) {
          setIsAuthenticating(false);
          setAuthError(null);
        }
      } catch (error: any) {
        console.error('Auth check error:', error);
        if (mounted) {
          setIsAuthenticating(false);
          setAuthError(error.message || 'Authentication check failed');
          toast.error('Authentication error');
        }
      }
    };
    
    // Check authentication
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      }
    });
    
    return () => {
      mounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Load company data only after authentication is confirmed
  useEffect(() => {
    if (!isAuthenticating && !companyLoading && !company) {
      console.log('No company found, refreshing company data');
      refreshCompany();
    }
  }, [company, companyLoading, refreshCompany, isAuthenticating]);

  const handleRefresh = () => {
    console.log('Manually refreshing company data from OfficeSettings');
    refreshCompany();
  };

  // Show a loading spinner while authenticating
  if (isAuthenticating) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
          {authError && (
            <div className="text-sm text-red-500 mt-2 max-w-md text-center">
              {authError}
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto" 
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // After authentication is confirmed, render the page
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-row">
        <div className="flex-shrink-0">
          <DashboardSidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <AppHeader />
          <div style={{ height: HEADER_HEIGHT }} />
          <div className="flex-1 p-2 sm:p-8 bg-background">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="flex justify-between items-center px-2 sm:px-0">
                <h1 className="text-4xl font-bold">Office Settings</h1>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleRefresh}
                  className="gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> 
                  Refresh Data
                </Button>
              </div>
              
              {companyLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading company data...</p>
                  </div>
                </div>
              ) : !company ? (
                <div className="p-6 rounded-lg border border-red-500/30 bg-red-500/10">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-foreground">No company context found</h3>
                      <p className="text-muted-foreground">
                        This could be happening because:
                      </p>
                      <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                        <li>You're not logged in</li>
                        <li>Your account isn't associated with a company</li>
                        <li>There was an issue retrieving your company data</li>
                      </ul>
                      <div className="flex gap-3 pt-2">
                        <Button onClick={() => navigate('/auth')}>
                          Go to Login
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleRefresh}
                          className="gap-2"
                        >
                          <RefreshCw className="h-4 w-4" /> 
                          Refresh Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <OfficeSettingsProvider>
                  <Tabs defaultValue="areas" className="w-full">
                    <TabsList className={tabBarClass + " flex sm:grid"}>
                      <TabsTrigger value="areas" className="flex items-center gap-2 min-w-max">
                        <Folder className="h-4 w-4" />
                        <span className="hidden xs:inline">Project Areas</span>
                      </TabsTrigger>
                      <TabsTrigger value="stages" className="flex items-center gap-2 min-w-max">
                        <Layers className="h-4 w-4" />
                        <span className="hidden xs:inline">Stages</span>
                      </TabsTrigger>
                      <TabsTrigger value="locations" className="flex items-center gap-2 min-w-max">
                        <MapPin className="h-4 w-4" />
                        <span className="hidden xs:inline">Locations</span>
                      </TabsTrigger>
                      <TabsTrigger value="roles" className="flex items-center gap-2 min-w-max">
                        <Briefcase className="h-4 w-4" />
                        <span className="hidden xs:inline">Roles</span>
                      </TabsTrigger>
                      <TabsTrigger value="rates" className="flex items-center gap-2 min-w-max">
                        <Currency className="h-4 w-4" />
                        <span className="hidden xs:inline">Rates</span>
                      </TabsTrigger>
                      <TabsTrigger value="holidays" className="flex items-center gap-2 min-w-max">
                        <Calendar className="h-4 w-4" />
                        <span className="hidden xs:inline">Holidays</span>
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="areas" className="mt-4">
                      <CountriesTab />
                    </TabsContent>
                    <TabsContent value="stages" className="mt-4">
                      <StagesTab />
                    </TabsContent>
                    <TabsContent value="locations" className="mt-4">
                      <LocationsTab />
                    </TabsContent>
                    <TabsContent value="roles" className="mt-4">
                      <RolesTab />
                    </TabsContent>
                    <TabsContent value="rates" className="mt-4">
                      <RatesTab />
                    </TabsContent>
                    <TabsContent value="holidays" className="mt-4">
                      <HolidaysTab />
                    </TabsContent>
                  </Tabs>
                </OfficeSettingsProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default OfficeSettings;
